import { ChainId } from '../../../chains/src'

export const DEFAULT_GAS_LIMIT = BigInt(150000000)

export const DEFAULT_GAS_LIMIT_BY_CHAIN: { [key in ChainId]?: bigint } = {
  [ChainId.XLAYER_TESTNET]: DEFAULT_GAS_LIMIT,
  [ChainId.SONIC_TESTNET]: DEFAULT_GAS_LIMIT
}

export const DEFAULT_GAS_BUFFER = BigInt(3000000)

export const DEFAULT_GAS_BUFFER_BY_CHAIN: { [key in ChainId]?: bigint } = {
  [ChainId.XLAYER_TESTNET]: DEFAULT_GAS_BUFFER,
  [ChainId.SONIC_TESTNET]: DEFAULT_GAS_BUFFER
}
