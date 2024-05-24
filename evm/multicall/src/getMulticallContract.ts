import { ChainId } from '../../chains/src'
import { Address, PublicClient, getContract } from 'viem'

import { iMulticallABI } from './abis/IMulticall'
import { MULTICALL3_ADDRESSES, MULTICALL_ADDRESS } from './constants/contracts'

type Params = {
  chainId: ChainId
  client?: PublicClient
}

export function getMulticallContract({ chainId, client }: Params) {
  const address = MULTICALL_ADDRESS[chainId]
  if (!address) {
    throw new Error(`PancakeMulticall not supported on chain ${chainId}`)
  }

  return getContract({ abi: iMulticallABI, address, publicClient: client as PublicClient })
}

export function getMulticall3ContractAddress(chainId?: ChainId): Address {
  return MULTICALL3_ADDRESSES[chainId || ChainId.XLAYER_TESTNET] || '0x6207dc4f7f0632d8e90034be5e04dfa3a731b564'
}
