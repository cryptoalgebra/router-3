import { Currency, Pair, Price } from '@pancakeswap/sdk'
import { computePoolAddress, Token as TokenJSBI } from '@cryptoalgebra/swapx-sdk'
import { Pool as SDKV3Pool } from '@pancakeswap/v3-sdk'
import memoize from 'lodash/memoize.js'
import { Address, keccak256, encodePacked, getCreate2Address } from 'viem'

import { Pool, PoolType, StablePool, V2Pool, V3Pool } from '../types'

export function computePairAddress(token0: TokenJSBI, token1: TokenJSBI, isStable: boolean) {
  const [_token0, _token1] = token0.sortsBefore(token1) ? [token0, token1] : [token1, token0]
  const salt = keccak256(
    encodePacked(['address', 'address', 'bool'], [_token0.address as Address, _token1.address as Address, isStable])
  )
  return getCreate2Address({
    from: '0xf532839E3B36Bac7281B4986e197127166eFD6De',
    salt,
    bytecodeHash: '0x0d0128a81f322b1beff50a2fe5e23a194fffc4f7c81736e27af97cded386e788'
  })
}

export function isV2Pool(pool: Pool): pool is V2Pool {
  return pool.type === PoolType.V2
}

export function isV3Pool(pool: Pool): pool is V3Pool {
  return pool.type === PoolType.V3
}

export function isStablePool(pool: Pool): pool is StablePool {
  return pool.type === PoolType.STABLE
}

export function involvesCurrency(pool: Pool, currency: Currency) {
  const token = currency.wrapped
  if (isV2Pool(pool) || isStablePool(pool)) {
    const { reserve0, reserve1 } = pool
    return reserve0.currency.equals(token) || reserve1.currency.equals(token)
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool
    return token0.equals(token) || token1.equals(token)
  }
  return false
}

// FIXME current verison is not working with stable pools that have more than 2 tokens
export function getOutputCurrency(pool: Pool, currencyIn: Currency): Currency {
  const tokenIn = currencyIn.wrapped
  if (isV2Pool(pool) || isStablePool(pool)) {
    const { reserve0, reserve1 } = pool
    return reserve0.currency.equals(tokenIn) ? reserve1.currency : reserve0.currency
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool
    return token0.equals(tokenIn) ? token1 : token0
  }
  throw new Error('Cannot get output currency by invalid pool')
}

export const computeV3PoolAddress = memoize(
  computePoolAddress,
  ({ poolDeployer, tokenA, tokenB, initCodeHashManualOverride }) =>
    `${tokenA.chainId}_${poolDeployer}_${tokenA.address}_${initCodeHashManualOverride}_${tokenB.address}`,
)

export const computeV2PoolAddress = memoize(
  computePairAddress,
  (tokenA, tokenB, isStable) => `${tokenA.chainId}_${tokenA.address}_${tokenB.address}_${isStable}`,
)

export const getPoolAddress = function getAddress(pool: Pool): Address | '' {
  if (isV3Pool(pool)) {
    return pool.address
  }
  if (isV2Pool(pool)) {
    const { reserve0, reserve1 } = pool
    return computeV2PoolAddress(reserve0.currency.wrapped, reserve1.currency.wrapped, false)
  }
  if (isStablePool(pool)) {
    const { reserve0, reserve1 } = pool
    return computeV2PoolAddress(reserve0.currency.wrapped, reserve1.currency.wrapped, true)
  }
  return ''
}

export function getTokenPrice(pool: Pool, base: Currency, quote: Currency): Price<Currency, Currency> {
  if (isV3Pool(pool)) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool
    const v3Pool = new SDKV3Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick)
    return v3Pool.priceOf(base.wrapped)
  }

  if (isV2Pool(pool) || isStablePool(pool)) {
    //@ts-ignore
    Pair.getAddress = computePairAddress.bind(Pair, pool.reserve0.currency.wrapped, pool.reserve1.currency.wrapped, isStablePool(pool));
    const pair = new Pair(pool.reserve0.wrapped, pool.reserve1.wrapped)
    return pair.priceOf(base.wrapped)
  }

  return new Price(base, quote, BigInt(1), BigInt(0))
}
