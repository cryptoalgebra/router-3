import { ChainId } from '../chains/src'
import { Token } from '@pancakeswap/sdk'

import { ChainMap, ChainTokenList } from '../types'
import { ROUTER_V2, SWAP_ROUTER_02 } from './addresses'
import { xLayerTestnetTokens } from './tokens'

export const SMART_ROUTER_ADDRESSES = {
  [ChainId.XLAYER_TESTNET]: SWAP_ROUTER_02,
  [ChainId.XLAYER]: SWAP_ROUTER_02,
} as const satisfies Record<ChainId, string>

export const V2_ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.XLAYER_TESTNET]: ROUTER_V2,
  [ChainId.XLAYER]: ROUTER_V2
}

export const STABLE_SWAP_INFO_ADDRESS: ChainMap<string> = {
  [ChainId.XLAYER]: '',
  [ChainId.XLAYER_TESTNET]: ''
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.XLAYER_TESTNET]: [xLayerTestnetTokens.usdt, xLayerTestnetTokens.weth, xLayerTestnetTokens.t1],
  [ChainId.XLAYER]: []
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
