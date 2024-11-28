import { ChainId } from '../../chains/src'

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = BigInt(0)

export const BASE_SWAP_COST_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.KAKAROT_SEPOLIA:
      return BigInt(2000)
    default:
      return BigInt(0)
  }
}
export const COST_PER_INIT_TICK = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.KAKAROT_SEPOLIA:
      return BigInt(31000)
    default:
      return BigInt(0)
  }
}

export const COST_PER_HOP_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.KAKAROT_SEPOLIA:
      return BigInt(80000)
    default:
      return BigInt(0)
  }
}
