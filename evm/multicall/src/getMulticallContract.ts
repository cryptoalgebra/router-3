import { ChainId } from '../../chains/src'
import { Address, PublicClient, getContract } from 'viem'

import { iMulticallABI } from './abis/IMulticall'
import { MULTICALL3_ADDRESSES, MULTICALL_ADDRESS } from './constants'

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
  return MULTICALL3_ADDRESSES[chainId || ChainId.HOLESKY] || '0xca11bde05977b3631167028862be2a173976ca11'
}
