import { BigintIsh, Currency, CurrencyAmount, Token, TradeType } from '@pancakeswap/sdk'
import { Currency as CurrencyJSBI, CurrencyAmount as CurrencyAmountJSBI, ZERO } from '@cryptoalgebra/swapx-sdk'
import { ChainId } from '../chains/src'

import { computeAllRoutes, getBestRouteCombinationByQuotes } from './functions'
import { createGasModel } from './gasModel'
import { getRoutesWithValidQuote } from './getRoutesWithValidQuote'
import { BestRoutes, TradeConfig, RouteConfig, SmartRouterTrade, RouteType } from './types'
import { ROUTE_CONFIG_BY_CHAIN } from './constants'

export async function getBestTrade(
  amount: CurrencyAmount<Currency> | CurrencyAmountJSBI<CurrencyJSBI>,
  currency: Currency | CurrencyJSBI,
  tradeType: TradeType,
  config: TradeConfig,
): Promise<SmartRouterTrade<TradeType> | null> {

  const currencyBN = new Token(currency.chainId, currency.wrapped.address, currency.decimals, currency.symbol || "", currency.name)

  const amountCurrencyBN = new Token(amount.currency.chainId, amount.currency.wrapped.address, amount.currency.decimals, amount.currency.symbol || "", amount.currency.name)

  const amountBN = CurrencyAmount.fromRawAmount(amountCurrencyBN, BigInt(amount.quotient.toString()))

  const { blockNumber: blockNumberFromConfig } = config
  const blockNumber: BigintIsh | undefined =
    typeof blockNumberFromConfig === 'function' ? await blockNumberFromConfig() : blockNumberFromConfig
  const bestRoutes = await getBestRoutes(amountBN, currencyBN, tradeType, {
    ...config,
    blockNumber,
  })
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(ZERO)) {
    throw new Error('Cannot find a valid swap route')
  }

  const { routes, gasEstimateInUSD, gasEstimate, inputAmount, outputAmount } = bestRoutes
  // TODO restrict trade type to exact input if routes include one of the old
  // stable swap pools, which only allow to swap with exact input
  
  return {
    tradeType,
    routes,
    gasEstimate,
    gasEstimateInUSD,
    inputAmount: CurrencyAmountJSBI.fromRawAmount(inputAmount.currency, inputAmount.quotient.toString()),
    outputAmount: CurrencyAmountJSBI.fromRawAmount(outputAmount.currency, outputAmount.quotient.toString()),
    blockNumber,
  }
}

async function getBestRoutes(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  routeConfig: RouteConfig,
): Promise<BestRoutes | null> {
  const { chainId } = currency
  const {
    maxHops = 3,
    maxSplits = 4,
    distributionPercent = 5,
    poolProvider,
    quoteProvider,
    blockNumber,
    gasPriceWei,
    allowedPoolTypes,
    quoterOptimization,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
    signal,
  } = {
    ...routeConfig,
    ...(ROUTE_CONFIG_BY_CHAIN[chainId as ChainId] || {}),
  }
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools({
    currencyA: amount.currency,
    currencyB: currency,
    blockNumber,
    protocols: allowedPoolTypes,
    signal,
  })

  let baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops)
  // Do not support mix route on exact output
  if (tradeType === TradeType.EXACT_OUTPUT) {
    baseRoutes = baseRoutes.filter(({ type }) => type !== RouteType.MIXED)
  }

  const gasModel = await createGasModel({
    gasPriceWei,
    poolProvider,
    quoteCurrency: currency,
    blockNumber,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
  })
  const routesWithValidQuote = await getRoutesWithValidQuote({
    amount,
    baseRoutes,
    distributionPercent,
    quoteProvider,
    tradeType,
    blockNumber,
    gasModel,
    quoterOptimization,
    signal,
  })
  // routesWithValidQuote.forEach(({ percent, path, amount: a, quote }) => {
  //   const pathStr = path.map((t) => t.symbol).join('->')
  //   console.log(
  //     `${percent}% Swap`,
  //     a.toExact(),
  //     a.currency.symbol,
  //     'through',
  //     pathStr,
  //     ':',
  //     quote.toExact(),
  //     quote.currency.symbol,
  //   )
  // })
  return getBestRouteCombinationByQuotes(amount, currency, routesWithValidQuote, tradeType, { maxSplits })
}
