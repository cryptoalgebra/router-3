import { Token } from '@pancakeswap/sdk'
import { ChainId } from '../../chains/src'

import { usdGasTokensByChain } from '../../constants'

export function getUsdGasToken(chainId: ChainId): Token | null {
  return usdGasTokensByChain[chainId]?.[0] ?? null
}
