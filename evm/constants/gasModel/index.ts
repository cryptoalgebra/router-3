import { ChainId } from '../../chains/src'
import { Token } from '@pancakeswap/sdk'

import { sonicTestnetTokens, xLayerTestnetTokens } from '../tokens'

export const usdGasTokensByChain = {
  [ChainId.XLAYER_TESTNET]: [xLayerTestnetTokens.usdt],
  [ChainId.XLAYER]: [],
  [ChainId.SONIC_TESTNET]: [sonicTestnetTokens.usdt]
} satisfies Record<ChainId, Token[]>

export * from './stableSwap'
export * from './v2'
export * from './v3'
