import { ChainId } from "./chainId";

type SubgraphParams = {
  noderealApiKey?: string;
};

const publicSubgraphParams = {
  // Public key for nodereal subgraph endpoint
  noderealApiKey: "19bd2b3f75c24e23bb8a0e9d4f55b271",
};

export const V3_SUBGRAPHS = getV3Subgraphs(publicSubgraphParams);

export const V2_SUBGRAPHS = getV2Subgraphs(publicSubgraphParams);

export const BLOCKS_SUBGRAPHS = getBlocksSubgraphs(publicSubgraphParams);

export const STABLESWAP_SUBGRAPHS = {} as const;

export function getV3Subgraphs({ noderealApiKey }: SubgraphParams) {
  return {
    [ChainId.HOLESKY]:
      "https://api.studio.thegraph.com/query/82608/quick-test-info/version/latest",
  } as const satisfies Record<ChainId, string | null>;
}

export function getV2Subgraphs({ noderealApiKey }: SubgraphParams) {
  return {
    // [ChainId.HOLESKY]: 'https://api.studio.thegraph.com/query/82608/quick-test-info/version/latest'
  };
}

export function getBlocksSubgraphs({ noderealApiKey }: SubgraphParams) {
  return {
    [ChainId.HOLESKY]:
      "https://api.thegraph.com/subgraphs/name/iliaazhel/goerli-blocks",
  } as const;
}
