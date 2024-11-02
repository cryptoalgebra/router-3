import { ChainId } from '../../../chains/src'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.XLAYER_TESTNET]: '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564',
  [ChainId.SONIC_TESTNET]: '0x13e7ea93f9b9ea991549334e3f0a1ef46d7c2bfb',
}

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.XLAYER_TESTNET]: '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564',
  [ChainId.SONIC_TESTNET]: '0xe3104a157cc4c0d3c7c3a8c655092668d068c149'
}