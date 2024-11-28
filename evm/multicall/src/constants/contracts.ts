import { ChainId } from '../../../chains/src'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.KAKAROT_SEPOLIA]: '0x1c4cbb62e18cf9c137c5d85096b5bc7819082691'
}

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.KAKAROT_SEPOLIA]: '0x6d63b39017f379bfd0301293022581c6ef237a19'
}