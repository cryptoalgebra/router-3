import { ChainId } from '../../chains/src'
import { Token } from '@pancakeswap/sdk'

import { xLayerTestnetTokens } from '../tokens'

export const usdGasTokensByChain = {
  [ChainId.XLAYER_TESTNET]: [xLayerTestnetTokens.usdt],
  [ChainId.XLAYER]: []
} satisfies Record<ChainId, Token[]>

export * from './stableSwap'
export * from './v2'
export * from './v3'
