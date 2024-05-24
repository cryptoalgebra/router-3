import { ChainId } from '../../../chains/src'
import { Address } from 'viem'

export const MULTICALL_ADDRESS: { [key in ChainId]?: Address } = {
  [ChainId.XLAYER_TESTNET]: '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564'
}

export const MULTICALL3_ADDRESSES: {
  [key in ChainId]?: Address
} = {
  [ChainId.XLAYER_TESTNET]: '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564'
}