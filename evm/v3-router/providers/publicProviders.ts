import { GraphQLClient } from "graphql-request";
import { createPublicClient, defineChain, http, PublicClient } from "viem";
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

export const sonicTestnet = defineChain({
  id: 64165,
  network: 'Sonic Testnet',
  name: 'Sonic Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'S',
    symbol: 'S',
  },
  rpcUrls: {
    public: { http: ['https://rpc.testnet.soniclabs.com'] },
    default: { http: ['https://rpc.testnet.soniclabs.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Sonic',
      url: 'https://testnet.soniclabs.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xe3104a157cc4c0d3c7c3a8c655092668d068c149',
      blockCreated: 83325506,
    },
  },
});



export const publicClient = createPublicClient({
  chain: sonicTestnet,
  transport: http('https://rpc.testnet.soniclabs.com'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
}) as PublicClient

export const quoteProvider = createQuoteProvider({
  onChainProvider: () => publicClient,
})

export const v3SubgraphClient = new GraphQLClient('https://graph.testnet.soniclabs.com/gql/subgraphs/name/joxerx/swapx')
export const v2SubgraphClient = new GraphQLClient('https://graph.testnet.soniclabs.com/gql/subgraphs/name/joxerx/swapx')
