import { GraphQLClient } from "graphql-request";
import { createPublicClient, defineChain, fallback, http, PublicClient } from "viem";
import { createQuoteProvider } from "./quoteProviders";

const holeskyChain = defineChain({
  id: 17000,
  network: 'holesky',
  name: 'Holesky',
  nativeCurrency: { name: 'Holesky Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://ethereum-holesky-rpc.publicnode.com', 'https://holesky.drpc.org'],
    },
    public: {
      http: ['https://ethereum-holesky-rpc.publicnode.com', 'https://holesky.drpc.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://holesky.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://holesky.etherscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 77,
    },
  },
  testnet: true,
})

export const publicClient = createPublicClient({
  chain: holeskyChain,
  transport: fallback([http("https://ethereum-holesky-rpc.publicnode.com"), http("https://holesky.drpc.org")], { rank: false }),
  batch: {
      multicall: {
          batchSize: 1024 * 200,
      },
  },
}) as PublicClient;

export const quoteProvider = createQuoteProvider({
  onChainProvider: () => publicClient,
})

export const v3SubgraphClient = new GraphQLClient('https://api.studio.thegraph.com/query/50593/integral-v1-1/version/latest')
export const v2SubgraphClient = new GraphQLClient('https://swapx-graph.rocknblock.io/subgraphs/name/swapx/swapx')