import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Currency as CurrencyJSBI, CurrencyAmount as CurrencyAmountJSBI } from '@cryptoalgebra/swapx-sdk'

import { GasCost } from './gasCost'
import { Pool } from './pool'

export enum RouteType {
  V2,
  V3,
  STABLE,
  MIXED,
  MM,
}

export interface BaseRoute {
  // Support all v2, v3, stable, and combined
  // Can derive from pools
  type: RouteType

  // Pools that swap will go through
  pools: Pool[]

  path: Currency[]

  input: Currency

  output: Currency
}

export interface RouteWithoutQuote extends BaseRoute {
  percent: number
  amount: CurrencyAmount<Currency>
}

export type RouteEssentials = Omit<RouteWithoutQuote, 'input' | 'output' | 'amount'>

export interface Route extends RouteEssentials {
  inputAmount: CurrencyAmountJSBI<CurrencyJSBI>
  outputAmount: CurrencyAmountJSBI<CurrencyJSBI>
}

export interface RouteQuote extends GasCost {
  // If exact in, this is (quote - gasCostInToken). If exact out, this is (quote + gasCostInToken).
  quoteAdjustedForGas: CurrencyAmount<Currency>
  quote: CurrencyAmount<Currency>
}

export type RouteWithQuote = RouteWithoutQuote & RouteQuote

export type RouteWithoutGasEstimate = Omit<
  RouteWithQuote,
  'quoteAdjustedForGas' | 'gasEstimate' | 'gasCostInToken' | 'gasCostInUSD'
>

export interface BestRoutes {
  gasEstimate: bigint
  gasEstimateInUSD: CurrencyAmountJSBI<CurrencyJSBI>
  routes: Route[]
  inputAmount: CurrencyAmountJSBI<CurrencyJSBI>
  outputAmount: CurrencyAmountJSBI<CurrencyJSBI>
}
