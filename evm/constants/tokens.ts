import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '../chains/src'


export const holeskyTokens = {
  usdt: new ERC20Token(
    ChainId.HOLESKY,
    '0x7d98346b3b000c55904918e3d9e2fc3f94683b01',
    18,
    'USDT',
    'USDT',
  ),
  weth: new ERC20Token(
    ChainId.HOLESKY,
    '0x94373a4919b3240d86ea41593d5eba789fef3848',
    18,
    'WETH',
    'WETH',
  ),
}
