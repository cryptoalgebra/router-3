import { Currency, CurrencyAmount, Token, Native } from '@pancakeswap/sdk'
import { ChainId } from '../chains/src'
import { xLayerTestnetTokens } from '../constants/tokens'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId): Token | undefined {
  return currency?.isNative ? xLayerTestnetTokens.wokb : currency?.isToken ? currency : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount<Currency> | undefined,
  chainId: ChainId | undefined,
): CurrencyAmount<Token> | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? CurrencyAmount.fromRawAmount(token, currencyAmount.quotient) : undefined
}

export function unwrappedToken(token: Currency): Currency {
  if (token.isNative) {
    return token
  }

  if (token.equals(xLayerTestnetTokens.wokb)) return Native.onChain(token.chainId)
  return token
}
