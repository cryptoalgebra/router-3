import { Percent } from '@pancakeswap/sdk'

export const BIG_INT_TEN = BigInt(10)
// one basis point
export const BIPS_BASE = BigInt(10000)

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** BigInt(16) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(BigInt(50), BIPS_BASE)
