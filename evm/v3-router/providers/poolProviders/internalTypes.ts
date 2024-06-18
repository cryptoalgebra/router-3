import { Currency } from "@pancakeswap/sdk";
import { Address } from "viem";

// Information used to identify a pool
export interface PoolMeta {
  currencyA: Currency;
  currencyB: Currency;
  address: Address;
}

export interface V3PoolMeta extends PoolMeta {
  fee: number;
  deployer: Address;
}
