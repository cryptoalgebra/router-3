import { Token } from '@pancakeswap/sdk'
import { ChainId } from '../../chains/src'
import { xLayerTestnetTokens } from '../../constants/tokens'


export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return xLayerTestnetTokens.wokb ?? null
}
