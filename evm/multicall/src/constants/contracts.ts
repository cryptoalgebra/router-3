import { ChainId } from '../../../chains/src'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.HOLESKY]: '0x9e904c06d46a52ac9c73f6a788bc1bbdd106a13b'
}

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.HOLESKY]: '0xca11bde05977b3631167028862be2a173976ca11'
}