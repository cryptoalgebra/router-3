import { Token } from '@pancakeswap/sdk'
import { ChainId } from '../../chains/src'
import { holeskyTokens } from '../../constants/tokens'


export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return holeskyTokens.weth ?? null
}
