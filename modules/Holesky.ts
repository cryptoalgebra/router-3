import { WNATIVE as AlgebraWnative } from "@cryptoalgebra/integral-sdk";
import { ChainId } from "@pancakeswap/chains";
import { Token } from "@pancakeswap/swap-sdk-core";

declare module "@pancakeswap/chains" {
    export enum ChainId {
        ETHEREUM = 1,
        GOERLI = 5,
        BSC = 56,
        BSC_TESTNET = 97,
        ZKSYNC_TESTNET = 280,
        ZKSYNC = 324,
        OPBNB_TESTNET = 5611,
        OPBNB = 204,
        POLYGON_ZKEVM = 1101,
        POLYGON_ZKEVM_TESTNET = 1442,
        ARBITRUM_ONE = 42161,
        ARBITRUM_GOERLI = 421613,
        ARBITRUM_SEPOLIA = 421614,
        SCROLL_SEPOLIA = 534351,
        LINEA = 59144,
        LINEA_TESTNET = 59140,
        BASE = 8453,
        BASE_TESTNET = 84531,
        BASE_SEPOLIA = 84532,
        SEPOLIA = 11155111,
        HOLESKY = 17000,
    }

}

declare module "@pancakeswap/sdk" {
    const token = new Token()

    const chains: Record<ChainId, Token> = {}

    for (const chain in ChainId) {
        chains[ChainId[chain]] = token
    }

    export const WNATIVE = {
        ...chains,
        [ChainId.HOLESKY]: new Token(ChainId.HOLESKY, AlgebraWnative[ChainId.HOLESKY].address, 18, 'WETH'),
    }

}