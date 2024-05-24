import { GraphQLClient } from "graphql-request";
import { createPublicClient, defineChain, http } from "viem";
import { createQuoteProvider } from "./quoteProviders";

export const xLayerTestnet = defineChain({
  id: 195,
  network: 'X1 Testnet',
  name: 'X1 Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKB',
    symbol: 'OKB',
  },
  rpcUrls: {
    public: { http: ['https://xlayertestrpc.okx.com'] },
    default: { http: ['https://xlayertestrpc.okx.com'] },
  },
  blockExplorers: {
    default: {
      name: 'OKLink',
      url: 'https://www.okx.com/ru/explorer',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 624344,
    },
  },
});


export const publicClient = createPublicClient({
  chain: xLayerTestnet,
  transport: http('https://xlayertestrpc.okx.com'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

export const quoteProvider = createQuoteProvider({
  onChainProvider: () => publicClient,
})

export const v3SubgraphClient = new GraphQLClient('https://swapx-graph.rocknblock.io/subgraphs/name/swapx/swapx')
export const v2SubgraphClient = new GraphQLClient('https://swapx-graph.rocknblock.io/subgraphs/name/swapx/swapx')