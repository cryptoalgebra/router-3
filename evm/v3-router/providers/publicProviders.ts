import { GraphQLClient } from "graphql-request";
import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";
import { createQuoteProvider } from "./quoteProviders";

export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http('https://arb1.arbitrum.io/rpc'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const quoteProvider = createQuoteProvider({
  onChainProvider: () => publicClient,
})

export const v3SubgraphClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm-v3-2')
export const v2SubgraphClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/camelotlabs/camelot-amm')