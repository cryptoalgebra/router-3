import { GraphQLClient } from "graphql-request";
import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";
import { createQuoteProvider } from "./quoteProviders";

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http('https://holesky.drpc.org'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const quoteProvider = createQuoteProvider({
  onChainProvider: () => publicClient,
})

export const v3SubgraphClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/iliaazhel/integral-core')
export const v2SubgraphClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm')