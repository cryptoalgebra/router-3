import { Currency as CurrencyBN, CurrencyAmount as CurrencyAmountBN } from '@pancakeswap/swap-sdk-core'
import { Percent, CurrencyAmount, TradeType } from '@cryptoalgebra/swapx-sdk'

import { SmartRouterTrade } from '../types'
import { getMidPrice } from './route'

export function getPriceImpact(trade: SmartRouterTrade<TradeType>): Percent {
  let spotOutputAmount = CurrencyAmount.fromRawAmount(trade.outputAmount.currency, 0)

  for (const route of trade.routes) {
    const { inputAmount } = route
    // FIXME typing
    const midPrice = getMidPrice(route)
    const midPriceAmountBN = midPrice.quote(CurrencyAmountBN.fromRawAmount(inputAmount.wrapped.currency as CurrencyBN, inputAmount.quotient.toString()))

    spotOutputAmount = spotOutputAmount.add(CurrencyAmount.fromRawAmount(midPriceAmountBN.currency, midPriceAmountBN.quotient.toString()))
  }
  const priceImpact = spotOutputAmount.subtract(trade.outputAmount.wrapped).divide(spotOutputAmount)
  return new Percent(priceImpact.numerator.toString(), priceImpact.denominator.toString())
}
