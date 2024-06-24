import { Hex, encodePacked } from 'viem'
import { Token } from '@pancakeswap/sdk'

import { BaseRoute, Pool } from '../types'
import { getOutputCurrency, isStablePool, isV2Pool, isV3Pool } from './pool'
import { V2_FEE_PATH_PLACEHOLDER } from '../../constants'

/**
 * Converts a route to a hex encoded path
 * @param route the mixed path to convert to an encoded path
 * @returns the encoded path
 */
export function encodeMixedRouteToPath(route: BaseRoute, exactOutput: boolean, isV3Only: boolean): Hex {
  const firstInputToken: Token = route.input.wrapped

  const { path, types } = route.pools.reduce(
    (
      // eslint-disable-next-line @typescript-eslint/no-shadow
      { inputToken, path, types }: { inputToken: Token; path: (string | number)[]; types: string[] },
      pool: Pool,
      index,
    ): { inputToken: Token; path: (string | number)[]; types: string[] } => {
      const outputToken = getOutputCurrency(pool, inputToken).wrapped

      const version = isV3Pool(pool) ? 0 : isStablePool(pool) ? 2 : isV2Pool(pool) ? 1 : -1 

      if (index === 0) {
        return {
          inputToken: outputToken,
          types: isV3Only ? ['address', 'address'] : ['address', "uint24", 'address'],
          path: isV3Only ? [inputToken.address, outputToken.address] : [inputToken.address, version, outputToken.address]
        }
      }
      return {
        inputToken: outputToken,
        types: isV3Only ? [...types, 'address'] : [...types, "uint24", 'address'],
        path: isV3Only ? [...path, outputToken.address] : [...path, version, outputToken.address]
      }
    },
    { inputToken: firstInputToken, path: [], types: [] },
  )

  return exactOutput ? encodePacked(types.reverse(), path.reverse()) : encodePacked(types, path)
}
