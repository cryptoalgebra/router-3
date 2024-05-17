import { ChainId } from '../../../chains/src'
import { BigintIsh, Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { FeeAmount, parseProtocolFees } from '@pancakeswap/v3-sdk'
import { Abi, Address, ContractFunctionConfig } from 'viem'
import { algebraPoolABI } from '../../../abis/AlgebraPoolABI'

import { pancakePairABI } from '../../../abis/IPancakePair'
import { OnChainProvider, Pool, PoolType, StablePool, V2Pool, V3Pool } from '../../types'
import { computeV2PoolAddress, computeV3PoolAddress } from '../../utils'
import { PoolMeta, V3PoolMeta } from './internalTypes'
import { ALGEBRA_POOL_DEPLOYER, POOL_INIT_CODE_HASH } from '../../../constants/addresses'

export const getV2PoolsOnChain = createOnChainPoolFactory<V2Pool | StablePool, PoolMeta>({
  abi: pancakePairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => [
    { address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped, false), currencyA, currencyB },
    { address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped, true), currencyA, currencyB },
  ],
  buildPoolInfoCalls: (address) => [
    {
      address,
      functionName: 'getReserves',
      args: [],
    },
    {
      address,
      functionName: 'stable',
      args: []
    }
  ],
  buildPool: ({ currencyA, currencyB }, [reserves, isStable]) => {
    if (!reserves) {
      return null
    }

    const [reserve0, reserve1] = reserves
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]

    return {
      type: isStable ? PoolType.STABLE : PoolType.V2,
      reserve0: CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      reserve1: CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
    }
  },
})

export const getV3PoolsWithoutTicksOnChain = createOnChainPoolFactory<V3Pool, V3PoolMeta>({
  abi: algebraPoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    return [FeeAmount.LOWEST].map((fee) => ({
      address: computeV3PoolAddress({
        poolDeployer: ALGEBRA_POOL_DEPLOYER,
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        initCodeHashManualOverride: POOL_INIT_CODE_HASH
      }) as Address,
      currencyA,
      currencyB,
      fee,
    }))
  },
  buildPoolInfoCalls: (address) => [
    {
      address,
      functionName: 'liquidity',
    },
    {
      address,
      functionName: 'globalState',
    },
  ],
  buildPool: ({ currencyA, currencyB, fee, address }, [liquidity, globalState]) => {
    if (!globalState) {
      return null
    }
    const [sqrtPriceX96, tick] = globalState
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(0)
    return {
      type: PoolType.V3,
      token0,
      token1,
      fee,
      liquidity: BigInt(liquidity.toString()),
      sqrtRatioX96: BigInt(sqrtPriceX96.toString()),
      tick: Number(tick),
      address,
      token0ProtocolFee,
      token1ProtocolFee,
    }
  },
})

interface OnChainPoolFactoryParams<TPool extends Pool, TPoolMeta extends PoolMeta, TAbi extends Abi | unknown[] = Abi> {
  abi: TAbi
  getPossiblePoolMetas: (pair: [Currency, Currency]) => TPoolMeta[]
  buildPoolInfoCalls: (poolAddress: Address) => Omit<ContractFunctionConfig<TAbi>, 'abi'>[]
  buildPool: (poolMeta: TPoolMeta, data: any[]) => TPool | null
}

function createOnChainPoolFactory<
  TPool extends Pool,
  TPoolMeta extends PoolMeta = PoolMeta,
  TAbi extends Abi | unknown[] = Abi,
>({ abi, getPossiblePoolMetas, buildPoolInfoCalls, buildPool }: OnChainPoolFactoryParams<TPool, TPoolMeta, TAbi>) {
  return async function poolFactory(
    pairs: [Currency, Currency][],
    provider?: OnChainProvider,
    blockNumber?: BigintIsh,
  ): Promise<TPool[]> {
    if (!provider) {
      throw new Error('No valid onchain data provider')
    }

    const chainId: ChainId = pairs[0]?.[0]?.chainId
    const client = provider({ chainId })
    if (!chainId || !client) {
      return []
    }

    const poolAddressSet = new Set<string>()

    const poolMetas: TPoolMeta[] = []
    for (const pair of pairs) {
      const possiblePoolMetas = getPossiblePoolMetas(pair)
      for (const meta of possiblePoolMetas) {
        if (!poolAddressSet.has(meta.address)) {
          poolMetas.push(meta)
          poolAddressSet.add(meta.address)
        }
      }
    }

    let calls: Omit<ContractFunctionConfig<TAbi>, 'abi'>[] = []
    let poolCallSize = 0
    for (const { address } of poolMetas) {
      const poolCalls = buildPoolInfoCalls(address)
      if (!poolCallSize) {
        poolCallSize = poolCalls.length
      }
      if (!poolCallSize || poolCallSize !== poolCalls.length) {
        throw new Error('Inconsistent pool data call')
      }
      calls = [...calls, ...poolCalls]
    }

    if (!calls.length) {
      return []
    }

    const results = await client.multicall({
      contracts: calls.map((call) => ({
        abi: abi as any,
        address: call.address as `0x${string}`,
        functionName: call.functionName,
        args: call.args as any,
      })),
      allowFailure: true,
      blockNumber: blockNumber ? BigInt(Number(BigInt(blockNumber))) : undefined,
    })

    const pools: TPool[] = []
    for (let i = 0; i < poolMetas.length; i += 1) {
      const poolResults = results.slice(i * poolCallSize, (i + 1) * poolCallSize)
      const pool = buildPool(
        poolMetas[i],
        poolResults.map((result) => result.result),
      )
      if (pool) {
        pools.push(pool)
      }
    }
    return pools
  }
}
