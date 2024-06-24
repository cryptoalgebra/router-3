import { ChainId } from '../chains/src'
import { Address } from 'viem'
import { ALGEBRA_QUOTER, MIXED_ROUTE_QUOTER_V1 } from './addresses'

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'

export const MIXED_ROUTE_QUOTER_ADDRESSES = {
  [ChainId.HOLESKY]: MIXED_ROUTE_QUOTER_V1
} as const satisfies Record<ChainId, Address>

export const V3_QUOTER_ADDRESSES = {
  [ChainId.HOLESKY]: ALGEBRA_QUOTER
} as const satisfies Record<ChainId, Address>
