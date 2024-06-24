import { ChainId } from '../../chains/src'

import { BLOCK_CONFLICT_TOLERANCE, DEFAULT_BLOCK_CONFLICT_TOLERANCE } from './constants'

export function getBlockConflictTolerance(chainId: ChainId) {
  return BLOCK_CONFLICT_TOLERANCE[chainId] || DEFAULT_BLOCK_CONFLICT_TOLERANCE
}
