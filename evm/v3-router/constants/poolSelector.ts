import { ChainId } from '@pancakeswap/chains'
import { arbitrumTokens } from '@pancakeswap/tokens'

import { PoolSelectorConfig, PoolSelectorConfigChainMap, TokenPoolSelectorConfigChainMap } from '../types'

export const DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfig = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3,
}

export const V3_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap = {
  [ChainId.ARBITRUM_ONE]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  }
}

export const V2_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap = {
  [ChainId.ARBITRUM_ONE]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
}

// Use to configure pool selector config when getting quote from specific tokens
// Allow to increase or decrese the number of candidate pools to calculate routes from
export const V3_TOKEN_POOL_SELECTOR_CONFIG: TokenPoolSelectorConfigChainMap = {
  [ChainId.ARBITRUM_ONE]: {
    [arbitrumTokens.arb.address]: {
      topNTokenInOut: 4,
    },
    [arbitrumTokens.weth.address]: {
      topNTokenInOut: 4,
    }
  },
}

export const V2_TOKEN_POOL_SELECTOR_CONFIG: TokenPoolSelectorConfigChainMap = {}
