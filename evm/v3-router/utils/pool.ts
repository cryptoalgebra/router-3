import { Currency, Pair, Price, Token } from "@pancakeswap/sdk";
import { computePoolAddress } from "@cryptoalgebra/swapx-sdk";
import { Pool as SDKV3Pool } from "@pancakeswap/v3-sdk";
import memoize from "lodash/memoize.js";
import { Address, keccak256, encodePacked, getCreate2Address } from "viem";

import { Pool, PoolType, StablePool, V2Pool, V3Pool } from "../types";

export function computePairAddress(
  token0: Token,
  token1: Token,
  isStable: boolean
) {
  const [_token0, _token1] = token0.sortsBefore(token1)
    ? [token0, token1]
    : [token1, token0];
  const salt = keccak256(
    encodePacked(
      ["address", "address", "bool"],
      [_token0.address as Address, _token1.address as Address, isStable]
    )
  );
  return getCreate2Address({
    from: "0xef6726076b6c155bcb05e2f85fd3b373e049ed4d",
    salt,
    bytecodeHash:
      "0x6c45999f36731ff6ab43e943fca4b5a700786bbb202116cf6633b32039161e05",
  });
}

export function isV2Pool(pool: Pool): pool is V2Pool {
  return pool.type === PoolType.V2;
}

export function isV3Pool(pool: Pool): pool is V3Pool {
  return pool.type === PoolType.V3;
}

export function isStablePool(pool: Pool): pool is StablePool {
  return pool.type === PoolType.STABLE;
}

export function involvesCurrency(pool: Pool, currency: Currency) {
  const token = currency.wrapped;
  if (isV2Pool(pool) || isStablePool(pool)) {
    const { reserve0, reserve1 } = pool;
    return reserve0.currency.equals(token) || reserve1.currency.equals(token);
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool;
    return token0.equals(token) || token1.equals(token);
  }
  return false;
}

// FIXME current verison is not working with stable pools that have more than 2 tokens
export function getOutputCurrency(pool: Pool, currencyIn: Currency): Currency {
  const tokenIn = currencyIn.wrapped;
  if (isV2Pool(pool) || isStablePool(pool)) {
    const { reserve0, reserve1 } = pool;
    return reserve0.currency.equals(tokenIn)
      ? reserve1.currency
      : reserve0.currency;
  }
  if (isV3Pool(pool)) {
    const { token0, token1 } = pool;
    return token0.equals(tokenIn) ? token1 : token0;
  }
  throw new Error("Cannot get output currency by invalid pool");
}

export const computeV3PoolAddress = memoize(
  computePoolAddress,
  ({ poolDeployer, tokenA, tokenB, initCodeHashManualOverride }) =>
    `${tokenA.chainId}_${poolDeployer}_${tokenA.address}_${initCodeHashManualOverride}_${tokenB.address}`
);

export const computeV2PoolAddress = memoize(
  computePairAddress,
  (tokenA, tokenB, isStable) =>
    `${tokenA.chainId}_${tokenA.address}_${tokenB.address}_${isStable}`
);

export const getPoolAddress = function getAddress(pool: Pool): Address | "" {
  if (isV3Pool(pool)) {
    return pool.address;
  }
  if (isV2Pool(pool)) {
    const { reserve0, reserve1 } = pool;
    return computeV2PoolAddress(
      reserve0.currency.wrapped,
      reserve1.currency.wrapped,
      false
    );
  }
  if (isStablePool(pool)) {
    const { reserve0, reserve1 } = pool;
    return computeV2PoolAddress(
      reserve0.currency.wrapped,
      reserve1.currency.wrapped,
      true
    );
  }
  return "";
};

export function getTokenPrice(
  pool: Pool,
  base: Currency,
  quote: Currency
): Price<Currency, Currency> {
  if (isV3Pool(pool)) {
    const { token0, token1, fee, liquidity, sqrtRatioX96, tick } = pool;
    const v3Pool = new SDKV3Pool(
      token0.wrapped,
      token1.wrapped,
      fee,
      sqrtRatioX96,
      liquidity,
      tick
    );
    return v3Pool.priceOf(base.wrapped);
  }

  if (isV2Pool(pool)) {
    //@ts-ignore
    Pair.getAddress = computePairAddress.bind(
      Pair,
      pool.reserve0.currency.wrapped,
      pool.reserve1.currency.wrapped,
      false
    );
    const pair = new Pair(pool.reserve0.wrapped, pool.reserve1.wrapped);
    return pair.priceOf(base.wrapped);
  }

  if (isStablePool(pool)) {
    //@ts-ignore
    Pair.getAddress = computePairAddress.bind(
      Pair,
      pool.reserve0.currency.wrapped,
      pool.reserve1.currency.wrapped,
      true
    );

    const price = getStableAmountOut(
      1000000000000000000n,
      base.wrapped.address,
      pool.reserve0.currency.wrapped.address,
      pool.reserve1.currency.wrapped.address,
      BigInt(pool.reserve0.currency.decimals),
      BigInt(pool.reserve1.currency.decimals),
      pool.reserve0.quotient,
      pool.reserve1.quotient,
      1n
    );

    return new Price(base, quote, 1000000000000000000n, price);
  }

  return new Price(base, quote, BigInt(1), BigInt(0));
}

function getStableAmountOut(
  amountIn: bigint,
  tokenIn: string,
  token0: string,
  token1: string,
  decimals0: bigint,
  decimals1: bigint,
  reserve0: bigint,
  reserve1: bigint,
  stableFee: bigint
) {
  amountIn = amountIn - (amountIn * stableFee) / BigInt(10000);

  let xy = k(reserve0, reserve1, decimals0, decimals1);
  reserve0 = (reserve0 * 1000000000000000000n) / decimals0;
  reserve1 = (reserve1 * 1000000000000000000n) / decimals1;
  let reserveIn = tokenIn == token0 ? reserve0 : reserve1;
  let reserveOut = tokenIn == token0 ? reserve1 : reserve0;
  amountIn =
    tokenIn == token0
      ? (amountIn * 1000000000000000000n) / decimals0
      : (amountIn * 1000000000000000000n) / decimals1;
  let y = reserveOut - get_y(amountIn + reserveIn, xy, reserveOut);
  return (
    (y * (tokenIn == token0 ? decimals1 : decimals0)) / 1000000000000000000n
  );
}

function k(
  reserve0: bigint,
  reserve1: bigint,
  decimals0: bigint,
  decimals1: bigint
) {
  let x = (reserve0 * 1000000000000000000n) / decimals0;
  let y = (reserve1 * 1000000000000000000n) / decimals1;
  let a = (x * y) / 1000000000000000000n;
  let b = (x * x) / 1000000000000000000n + (y * y) / 1000000000000000000n;
  return (a * b) / 1000000000000000000n;
}

function get_y(x0: bigint, xy: bigint, y: bigint) {
  for (let i = 0; i < 255; i++) {
    let y_prev = y;
    let k = _f(x0, y);
    if (k < xy) {
      let dy = ((xy - k) * 1000000000000000000n) / _d(x0, y);
      y = y + dy;
    } else {
      let dy = ((k - xy) * 1000000000000000000n) / _d(x0, y);
      y = y - dy;
    }
    if (y > y_prev) {
      if (y - y_prev <= 1) {
        return y;
      }
    } else {
      if (y_prev - y <= 1) {
        return y;
      }
    }
  }
  return y;
}

function _f(x0: bigint, y: bigint) {
  return (
    (x0 * ((((y * y) / 1000000000000000000n) * y) / 1000000000000000000n)) /
      1000000000000000000n +
    (((((x0 * x0) / 1000000000000000000n) * x0) / 1000000000000000000n) * y) /
      1000000000000000000n
  );
}

function _d(x0: bigint, y: bigint) {
  return (
    (BigInt(3) * x0 * ((y * y) / 1000000000000000000n)) / 1000000000000000000n +
    (((x0 * x0) / 1000000000000000000n) * x0) / 1000000000000000000n
  );
}
