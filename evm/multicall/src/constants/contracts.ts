import { ChainId } from '../../../chains/src'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.XLAYER_TESTNET]: '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564',
  [ChainId.SONIC_TESTNET]: '0xb4f9b6b019e75cbe51af4425b2fc12797e2ee2a1',
}

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.XLAYER_TESTNET]: '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564',
  [ChainId.SONIC_TESTNET]: '0x50fcbf85d23af7c91f94842fecd83d16665d27ba'
}