import { ChainId } from '../../../chains/src'
import { BigintIsh, Currency, Token } from '@pancakeswap/sdk'
import { Currency as CurrencyJSBI, Token as TokenJSBI } from '@cryptoalgebra/swapx-sdk'
import memoize from 'lodash/memoize.js'
import { Address } from 'viem'

import { OnChainProvider, SubgraphProvider, V3PoolWithTvl } from '../../types'
import { createAsyncCallWithFallbacks, WithFallbackOptions } from '../../../utils/withFallback'
import { getV3PoolSubgraph } from './subgraphPoolProviders'
import { getPairCombinations } from '../../functions'
import { v3PoolTvlSelector } from './poolTvlSelectors'
import { getV3PoolsWithoutTicksOnChain } from './onChainPoolProviders'
import { parseCurrency, serializeCurrency } from '../../utils/transformer'

// @deprecated
export type { GetV3PoolsParams as GetV3CandidatePoolsParams }

export type GetV3PoolsParams = {
  currencyA?: Currency | CurrencyJSBI
  currencyB?: Currency | CurrencyJSBI

  // V3 subgraph provider
  subgraphProvider?: SubgraphProvider
  onChainProvider?: OnChainProvider
  blockNumber?: BigintIsh

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

type DefaultParams = GetV3PoolsParams & {
  // In millisecond
  fallbackTimeout?: number
  subgraphFallback?: boolean
  staticFallback?: boolean
}

export interface V3PoolTvlReference extends Pick<V3PoolWithTvl, 'address'> {
  tvlUSD: bigint | string
}

const getV3PoolTvl = memoize(
  (pools: V3PoolTvlReference[], poolAddress: Address) => {
    const poolWithTvl = pools.find((p) => p.address === poolAddress)
    return poolWithTvl?.tvlUSD || BigInt(0)
  },
  (_, poolAddress) => poolAddress,
)

// Get pools from onchain and use the tvl data from subgraph as reference
// The reason we do this is the data from subgraph might delay
export const v3PoolsOnChainProviderFactory = <P extends GetV3PoolsParams = GetV3PoolsParams>(
  tvlReferenceProvider: (params: P) => Promise<V3PoolTvlReference[]>,
) => {
  return async function getV3PoolsWithTvlFromOnChain(params: P): Promise<V3PoolWithTvl[]> {
    let { currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber } = params

    if (currencyA instanceof TokenJSBI && currencyB instanceof TokenJSBI && currencyA.symbol && currencyB.symbol) {
      currencyA = new Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name)
      currencyB = new Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name)
    }

    const pairs = providedPairs || getPairCombinations(currencyA as Currency, currencyB as Currency)

    const [fromOnChain, tvlReference] = await Promise.allSettled([
      getV3PoolsWithoutTicksOnChain(pairs, onChainProvider, blockNumber),
      tvlReferenceProvider(params),
    ])

    if (fromOnChain.status === 'fulfilled' && tvlReference.status === 'fulfilled') {
      const { value: poolsFromOnChain } = fromOnChain
      const { value: poolTvlReferences } = tvlReference
      if (!Array.isArray(poolTvlReferences)) {
        throw new Error('Failed to get tvl references')
      }
      return poolsFromOnChain.map((pool) => {
        const tvlUSD = BigInt(getV3PoolTvl(poolTvlReferences, pool.address))
        return {
          ...pool,
          tvlUSD,
        }
      })
    }
    throw new Error(`Getting v3 pools failed. Onchain ${fromOnChain.status}, tvl references ${tvlReference.status}`)
  }
}

export const getV3PoolsWithTvlFromOnChain = v3PoolsOnChainProviderFactory((params: GetV3PoolsParams) => {
  let { currencyA, currencyB, pairs: providedPairs, subgraphProvider } = params 
  
  if (currencyA instanceof TokenJSBI && currencyB instanceof TokenJSBI && currencyA.symbol && currencyB.symbol) {
    currencyA = new Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name)
    currencyB = new Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name)
  }

  const pairs = providedPairs || getPairCombinations(currencyA as Currency, currencyB as Currency)
  return getV3PoolSubgraph({ provider: subgraphProvider, pairs })
})

const createFallbackTvlRefGetter = () => {
  const cache = new Map<ChainId, V3PoolTvlReference[]>()
  return async (params: GetV3PoolsParams) => {
    const { currencyA } = params
    if (!currencyA?.chainId) {
      throw new Error(`Cannot get tvl references at chain ${currencyA?.chainId}`)
    }
    const cached = cache.get(currencyA.chainId)
    if (cached) {
      return cached
    }

    throw 'E'
  }
}

export const getV3PoolsWithTvlFromOnChainFallback = v3PoolsOnChainProviderFactory(createFallbackTvlRefGetter())

export const getV3PoolsWithTvlFromOnChainStaticFallback = v3PoolsOnChainProviderFactory<
  Omit<GetV3PoolsParams, 'subgraphProvider' | 'onChainProvider'>
>(() => Promise.resolve([]))

type GetV3Pools<T = any> = (params: GetV3PoolsParams & T) => Promise<V3PoolWithTvl[]>

// @deprecated
export { createGetV3CandidatePools as createGetV3CandidatePoolsWithFallbacks }

export function createGetV3CandidatePools<T = any>(
  defaultGetV3Pools: GetV3Pools<T>,
  options?: WithFallbackOptions<GetV3Pools<T>>,
) {

  const getV3PoolsWithFallbacks = createAsyncCallWithFallbacks(defaultGetV3Pools, options)

  return async function getV3Pools(params: GetV3PoolsParams & T) {
    let { currencyA, currencyB } = params
    if (currencyA instanceof TokenJSBI && currencyB instanceof TokenJSBI && currencyA.symbol && currencyB.symbol) {
      currencyA = new Token(currencyA.chainId, currencyA.address, currencyA.decimals, currencyA.symbol, currencyA.name)
      currencyB = new Token(currencyB.chainId, currencyB.address, currencyB.decimals, currencyB.symbol, currencyB.name)
    }
    const pools = await getV3PoolsWithFallbacks(params)

    return v3PoolTvlSelector(currencyA as Currency, currencyB as Currency, pools)
  }
}

export async function getV3CandidatePools(params: DefaultParams) {
  const { subgraphFallback = true, staticFallback = true, fallbackTimeout, ...rest } = params

  const fallbacks: GetV3Pools[] = []

  // if (subgraphFallback) {
  //   // Fallback to get pools from on chain and ref tvl by subgraph
  //   fallbacks.push(getV3PoolsWithTvlFromOnChain)

  //   // Fallback to get all pools info from subgraph
  //   fallbacks.push(async (p) => {
  //     const { currencyA, currencyB, pairs: providedPairs, subgraphProvider } = p
  //     const pairs = providedPairs || getPairCombinations(currencyA, currencyB)
  //     return getV3PoolSubgraph({ provider: subgraphProvider, pairs })
  //   })
  // }

  // Fallback to get pools from on chain and static ref
  if (staticFallback) {
    fallbacks.push(getV3PoolsWithTvlFromOnChainStaticFallback)
  }

  // Deafult try get pools from on chain and ref tvl by subgraph cache
  const getV3PoolsWithFallback = createGetV3CandidatePools(getV3PoolsWithTvlFromOnChainStaticFallback, {
    fallbacks,
    fallbackTimeout,
  })
  return getV3PoolsWithFallback(rest)
}
