import { CurrencyAmount, Currency } from '@pancakeswap/sdk'

const PRECISION = BigInt(10) ** BigInt(18)

export const getRawAmount = (amount: CurrencyAmount<Currency>) => {
  return (amount.quotient * PRECISION) / BigInt(10) ** BigInt(amount.currency.decimals)
}

export const parseAmount = (currency: Currency, rawAmount: bigint) => {
  return CurrencyAmount.fromRawAmount(currency, (rawAmount * BigInt(10) ** BigInt(currency.decimals)) / PRECISION)
}
