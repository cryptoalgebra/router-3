import { ChainId } from '../../chains/src'
import { Token } from '@pancakeswap/sdk'

import { holeskyTokens } from '../tokens'

export const usdGasTokensByChain = {
  [ChainId.KAKAROT_SEPOLIA]: [holeskyTokens.usdt],
} satisfies Record<ChainId, Token[]>

export * from './stableSwap'
export * from './v2'
export * from './v3'
