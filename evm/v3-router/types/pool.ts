import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { Tick } from '@pancakeswap/v3-sdk'
import { Address } from 'viem'

export enum PoolType {
  V2,
  V3,
  STABLE,
}

export interface BasePool {
  type: PoolType
}

export interface V2Pool extends BasePool {
  type: PoolType.V2
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
}

export interface StablePool extends BasePool {
  type: PoolType.STABLE
  reserve0: CurrencyAmount<Currency>
  reserve1: CurrencyAmount<Currency>
}

export interface V3Pool extends BasePool {
  type: PoolType.V3
  token0: Currency
  token1: Currency
  // Different fee tier
  fee: number
  liquidity: bigint
  sqrtRatioX96: bigint
  tick: number
  address: Address
  deployer: Address
  token0ProtocolFee: Percent
  token1ProtocolFee: Percent

  // Allow pool with no ticks data provided
  ticks?: Tick[]
}

export type Pool = V2Pool | V3Pool | StablePool

export interface WithTvl {
  tvlUSD: bigint
}

export type V3PoolWithTvl = V3Pool & WithTvl

export type V2PoolWithTvl = V2Pool & WithTvl

export type StablePoolWithTvl = StablePool & WithTvl
