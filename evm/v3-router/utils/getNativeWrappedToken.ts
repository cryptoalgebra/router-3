import { Token } from '@pancakeswap/sdk'
import { ChainId } from '../../chains/src'
import { sonicTestnetTokens } from '../../constants/tokens'


export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return sonicTestnetTokens.ws ?? null
}
