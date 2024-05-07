import { ChainId } from '../../../chains/src'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.HOLESKY]: '0x4c4849b3aef966e5e39b4abf27767eada487eaa4'
}

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.HOLESKY]: '0xf7ca7d0f8bbef9bbfeb66cf2c9c84eeb2da60b22'
}
