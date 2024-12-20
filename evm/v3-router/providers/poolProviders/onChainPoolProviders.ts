import { ChainId } from '@pancakeswap/chains'
import { BigintIsh, Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { FeeAmount, parseProtocolFees } from '@pancakeswap/v3-sdk'
import { Abi, Address, ContractFunctionConfig } from 'viem'
import { algebraPoolABI } from '../../../abis/AlgebraPoolABI'

import { pancakePairABI } from '../../../abis/IPancakePair'
import { stableSwapPairABI } from '../../../abis/StableSwapPair'
import { getStableSwapPools } from '../../../constants/stableSwap'
import { OnChainProvider, Pool, PoolType, StablePool, V2Pool, V3Pool } from '../../types'
import { computeV2PoolAddress, computeV3PoolAddress } from '../../utils'
import { PoolMeta, V3PoolMeta } from './internalTypes'

export const getV2PoolsOnChain = createOnChainPoolFactory<V2Pool, PoolMeta>({
  abi: pancakePairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => [
    { address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped), currencyA, currencyB },
  ],
  buildPoolInfoCalls: (address) => [
    {
      address,
      functionName: 'getReserves',
      args: [],
    },
  ],
  buildPool: ({ currencyA, currencyB }, [reserves]) => {
    if (!reserves) {
      return null
    }
    const [reserve0, reserve1] = reserves
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.V2,
      reserve0: CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      reserve1: CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
    }
  },
})

export const getStablePoolsOnChain = createOnChainPoolFactory<StablePool, PoolMeta>({
  abi: stableSwapPairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const poolConfigs = getStableSwapPools(currencyA.chainId)
    return poolConfigs
      .filter(({ token, quoteToken }) => {
        const tokenA = deserializeToken(token)
        const tokenB = deserializeToken(quoteToken)
        return (
          (tokenA.equals(currencyA.wrapped) && tokenB.equals(currencyB.wrapped)) ||
          (tokenA.equals(currencyB.wrapped) && tokenB.equals(currencyA.wrapped))
        )
      })
      .map(({ stableSwapAddress }) => ({
        address: stableSwapAddress,
        currencyA,
        currencyB,
      }))
  },
  buildPoolInfoCalls: (address) => [
    {
      address,
      functionName: 'balances',
      args: [0],
    },
    {
      address,
      functionName: 'balances',
      args: [1],
    },
    {
      address,
      functionName: 'A',
      args: [],
    },
    {
      address,
      functionName: 'fee',
      args: [],
    },
    {
      address,
      functionName: 'FEE_DENOMINATOR',
      args: [],
    },
  ],
  buildPool: ({ currencyA, currencyB, address }, [balance0, balance1, a, fee, feeDenominator]) => {
    if (!balance0 || !balance1 || !a || !fee || !feeDenominator) {
      return null
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      address,
      type: PoolType.STABLE,
      balances: [
        CurrencyAmount.fromRawAmount(token0, balance0.toString()),
        CurrencyAmount.fromRawAmount(token1, balance1.toString()),
      ],
      amplifier: BigInt(a.toString()),
      fee: new Percent(BigInt(fee.toString()), BigInt(feeDenominator.toString())),
    }
  },
})

export const getV3PoolsWithoutTicksOnChain = createOnChainPoolFactory<V3Pool, V3PoolMeta>({
  abi: algebraPoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    return [FeeAmount.LOWEST].map((fee) => ({
      address: computeV3PoolAddress({
        poolDeployer: '0x6Dd3FB9653B10e806650F107C3B5A0a6fF974F65',
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        initCodeHashManualOverride: '0x6c1bebd370ba84753516bc1393c0d0a6c645856da55f5393ac8ab3d6dbc861d3'
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
