import { GraphQLClient } from "graphql-request";
import { createPublicClient, defineChain, fallback, http, PublicClient } from "viem";
import { createQuoteProvider } from "./quoteProviders";

const kakarotChain = defineChain({
  id: 920637907288165,
  network: 'kakarot-sepolia',
  name: 'Kakarot',
  nativeCurrency: { name: 'Kakarot Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.kakarot.org'],
    },
    public: {
      http: ['https://sepolia-rpc.kakarot.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Kakarotscan',
      url: 'https://sepolia.kakarotscan.org',
    },
    default: {
      name: 'Kakarotscan',
      url: 'https://sepolia.kakarotscan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0x6d63b39017f379bfd0301293022581c6ef237a19',
      blockCreated: 348826,
    },
  },
  testnet: true,
})

export const publicClient = createPublicClient({
  chain: kakarotChain,
  transport: fallback([http("https://sepolia-rpc.kakarot.org"), http("https://sepolia-rpc.kakarot.org")], { rank: false }),
  batch: {
      multicall: {
          batchSize: 1024 * 200,
      },
  },
}) as PublicClient;

export const quoteProvider = createQuoteProvider({
  onChainProvider: () => publicClient,
})

export const v3SubgraphClient = new GraphQLClient('https://query.kakarot.protofire.io/subgraphs/name/kakarot/algebra-analytics')
export const v2SubgraphClient = new GraphQLClient('https://swapx-graph.rocknblock.io/subgraphs/name/swapx/swapx')