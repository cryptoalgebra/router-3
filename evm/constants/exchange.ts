import { ChainId } from '../chains/src'
import { Token } from '@pancakeswap/sdk'

import { ChainMap, ChainTokenList } from '../types'
import { ROUTER_V2, SWAP_ROUTER_02 } from './addresses'
import { holeskyTokens } from './holeskyTokens'

export const SMART_ROUTER_ADDRESSES = {
  [ChainId.HOLESKY]: SWAP_ROUTER_02,
} as const satisfies Record<ChainId, string>

export const V2_ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.HOLESKY]: '0xeB0DAADf31cC744736471520fdc767e7681945b3'
}

export const STABLE_SWAP_INFO_ADDRESS: ChainMap<string> = {
  [ChainId.HOLESKY]: ''
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.HOLESKY]: [holeskyTokens.usdt, holeskyTokens.weth]
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
