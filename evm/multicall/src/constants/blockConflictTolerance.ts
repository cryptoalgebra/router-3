import { ChainId } from '../../../chains/src'

export const DEFAULT_BLOCK_CONFLICT_TOLERANCE = 0

export const BLOCK_CONFLICT_TOLERANCE: { [key in ChainId]?: number } = {
  [ChainId.XLAYER_TESTNET]: 3,
  [ChainId.XLAYER]: 3
}
