import { ChainId } from '../chains/src'
import { Token } from '@pancakeswap/sdk'

import { ChainTokenList } from '../types'
import { ALGEBRA_ROUTER } from './addresses'
import { holeskyTokens } from './tokens'

export const SMART_ROUTER_ADDRESSES = {
  [ChainId.KAKAROT_SEPOLIA]: ALGEBRA_ROUTER,
} as const satisfies Record<ChainId, string>

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.KAKAROT_SEPOLIA]: Object.values(holeskyTokens),
}


/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
}
