import { BigintIsh, Currency } from "@pancakeswap/sdk";

import { OnChainProvider, Pool, PoolType, SubgraphProvider } from "../../types";
import { getV2CandidatePools } from "./getV2CandidatePools";
import { getV3CandidatePools } from "./getV3CandidatePools";

export type GetCandidatePoolsParams = {
  currencyA?: Currency;
  currencyB?: Currency;

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][];

  onChainProvider?: OnChainProvider;
  v2SubgraphProvider?: SubgraphProvider;
  v3SubgraphProvider?: SubgraphProvider;
  blockNumber?: BigintIsh;
  protocols?: PoolType[];
};

export async function getCandidatePools({
  protocols = [PoolType.V3, PoolType.V2, PoolType.STABLE],
  v2SubgraphProvider,
  v3SubgraphProvider,
  ...rest
}: GetCandidatePoolsParams): Promise<Pool[]> {
  const { currencyA } = rest;
  const chainId = currencyA?.chainId;
  if (!chainId) {
    return [];
  }

  const poolSets = await Promise.all(
    protocols.map((protocol) => {
      if (protocol === PoolType.V2 || protocol === PoolType.STABLE) {
        return getV2CandidatePools({
          ...rest,
          v2SubgraphProvider,
          v3SubgraphProvider,
        });
      }
      return getV3CandidatePools({
        ...rest,
        subgraphProvider: v3SubgraphProvider,
      });
    })
  );

  return poolSets.reduce<Pool[]>((acc, cur) => [...acc, ...cur], []);
}
