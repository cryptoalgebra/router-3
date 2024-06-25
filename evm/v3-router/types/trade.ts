import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { Currency as CurrencyJSBI, CurrencyAmount as CurrencyAmountJSBI } from '@cryptoalgebra/swapx-sdk'
import { AbortControl } from '../../utils/abortControl'

import { Route } from './route'
import { PoolProvider, QuoteProvider } from './providers'
import { PoolType } from './pool'

export interface SmartRouterTrade<TTradeType extends TradeType> {
  tradeType: TTradeType
  inputAmount: CurrencyAmountJSBI<CurrencyJSBI>
  outputAmount: CurrencyAmountJSBI<CurrencyJSBI>

  // From routes we know how many splits and what percentage does each split take
  routes: Route[]

  gasEstimate: bigint
  gasEstimateInUSD: CurrencyAmountJSBI<CurrencyJSBI>

  blockNumber?: number
}

export type PriceReferences = {
  quoteCurrencyUsdPrice?: number
  nativeCurrencyUsdPrice?: number
}

export type TradeConfig = {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  blockNumber?: number | (() => Promise<number>)
  poolProvider: PoolProvider
  quoteProvider: QuoteProvider
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
  allowedPoolTypes?: PoolType[]
  quoterOptimization?: boolean
} & PriceReferences &
  AbortControl

export type RouteConfig = TradeConfig & {
  blockNumber?: number
}
