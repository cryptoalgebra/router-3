import { ChainId } from '@pancakeswap/chains'

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = BigInt(0)

export const BASE_SWAP_COST_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPBNB:
    case ChainId.OPBNB_TESTNET:
      return BigInt(2000)
    default:
      return BigInt(0)
  }
}
export const COST_PER_INIT_TICK = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPBNB:
    case ChainId.OPBNB_TESTNET:
      return BigInt(31000)
    default:
      return BigInt(0)
  }
}

export const COST_PER_HOP_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPBNB:
    case ChainId.OPBNB_TESTNET:
      return BigInt(80000)
    default:
      return BigInt(0)
  }
}
