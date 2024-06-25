import { SmartRouterTrade } from '../types'
import { ZERO, Price, TradeType } from '@cryptoalgebra/swapx-sdk'

export function getExecutionPrice(trade: SmartRouterTrade<TradeType> | null | undefined) {
  if (!trade) {
    return null
  }

  const { inputAmount, outputAmount } = trade
  if (inputAmount.quotient === ZERO || outputAmount.quotient === ZERO) {
    return null
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}
