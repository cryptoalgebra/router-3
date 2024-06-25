import { Percent, TradeType, Fraction, ONE, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Percent as PercentJSBI, CurrencyAmount as CurrencyAmountJSBI } from '@cryptoalgebra/swapx-sdk'

import { SmartRouterTrade } from '../types'

export function maximumAmountIn(trade: SmartRouterTrade<TradeType>, slippage: PercentJSBI, amountIn = trade.inputAmount) {
  const slippageBN = new Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()))

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return CurrencyAmountJSBI.fromRawAmount(amountIn.currency, amountIn.quotient.toString())
  }

  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageBN).multiply(amountIn.quotient.toString()).quotient

  return CurrencyAmountJSBI.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn.toString())
}

export function maximumAmountInBN(trade: SmartRouterTrade<TradeType>, slippage: Percent | PercentJSBI, amountIn = trade.inputAmount) {
  const slippageBN = new Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()))

  if (trade.tradeType === TradeType.EXACT_INPUT) {
    return CurrencyAmount.fromRawAmount(amountIn.currency as Currency, amountIn.quotient.toString())
  }

  const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageBN).multiply(amountIn.quotient.toString()).quotient

  return CurrencyAmount.fromRawAmount(amountIn.currency as Currency, slippageAdjustedAmountIn)
}

export function minimumAmountOut(
  trade: SmartRouterTrade<TradeType>,
  slippage: PercentJSBI,
  amountOut = trade.outputAmount,
) {
  const slippageBN = new Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()))

  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return CurrencyAmountJSBI.fromRawAmount(amountOut.currency, amountOut.quotient.toString())
  }

  const slippageAdjustedAmountOut = new Fraction(ONE).add(slippageBN).invert().multiply(amountOut.quotient.toString()).quotient

  return CurrencyAmountJSBI.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut.toString())
}

export function minimumAmountOutBN(
  trade: SmartRouterTrade<TradeType>,
  slippage: Percent | PercentJSBI,
  amountOut = trade.outputAmount,
) {
  const slippageBN = new Percent(BigInt(slippage.numerator.toString()), BigInt(slippage.denominator.toString()))

  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return CurrencyAmount.fromRawAmount(amountOut.currency as Currency, amountOut.quotient.toString())
  }

  const slippageAdjustedAmountOut = new Fraction(ONE).add(slippageBN).invert().multiply(amountOut.quotient.toString()).quotient

  return CurrencyAmount.fromRawAmount(amountOut.currency as Currency, slippageAdjustedAmountOut)
}
