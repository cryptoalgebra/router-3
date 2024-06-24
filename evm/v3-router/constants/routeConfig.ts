import { ChainId } from '../../chains/src'
import { RouteConfig } from '../types'

export const ROUTE_CONFIG_BY_CHAIN: { [key in ChainId]?: Partial<RouteConfig> } = {}
