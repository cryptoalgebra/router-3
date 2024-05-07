import { Token } from '@pancakeswap/sdk'
import { ChainId } from '../chains/src'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>
