import { ChainId } from '../../chains/src'
import { Token } from '@pancakeswap/sdk'

import { holeskyTokens } from '../tokens'

export const usdGasTokensByChain = {
  [ChainId.HOLESKY]: [holeskyTokens.usdt],
} satisfies Record<ChainId, Token[]>

export * from './stableSwap'
export * from './v2'
export * from './v3'
