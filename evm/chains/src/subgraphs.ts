import { ChainId } from './chainId'

type SubgraphParams = {
  noderealApiKey?: string
}

const publicSubgraphParams = {
  // Public key for nodereal subgraph endpoint
  noderealApiKey: '19bd2b3f75c24e23bb8a0e9d4f55b271',
}

export const V3_SUBGRAPHS = getV3Subgraphs(publicSubgraphParams)

export const V2_SUBGRAPHS = getV2Subgraphs(publicSubgraphParams)

export const BLOCKS_SUBGRAPHS = getBlocksSubgraphs(publicSubgraphParams)

export const STABLESWAP_SUBGRAPHS = {} as const

export function getV3Subgraphs({ noderealApiKey }: SubgraphParams) {
  return {
    [ChainId.XLAYER_TESTNET]: 'https://swapx-graph.rocknblock.io/subgraphs/name/swapx/stage',
    [ChainId.XLAYER]: '',
  } as const satisfies Record<ChainId, string | null>
}

export function getV2Subgraphs({ noderealApiKey }: SubgraphParams) {
  return {
    [ChainId.XLAYER_TESTNET]: 'https://swapx-graph.rocknblock.io/subgraphs/name/swapx/stage'
  }
}

export function getBlocksSubgraphs({ noderealApiKey }: SubgraphParams) {
  return {
    [ChainId.XLAYER_TESTNET]: 'http://3.129.109.139:7100/subgraphs/name/x1-testnet/blocks',
    [ChainId.XLAYER]: '',
  } as const
}
