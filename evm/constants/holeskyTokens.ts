import { ERC20Token } from '@pancakeswap/sdk'

export const holeskyTokens = {
  weth: new ERC20Token(
    17000,
    '0x94373a4919b3240d86ea41593d5eba789fef3848',
    6,
    'WETH',
    'WETH',
  ),
  usdt: new ERC20Token(
    17000,
    '0x7d98346b3b000c55904918e3d9e2fc3f94683b01',
    6,
    'USDT',
    'USDT',
  ),
  skate: new ERC20Token(
    17000,
    '0x2331a24b97acf5eb35e7d627cdf8ebf07f20c305',
    6,
    'SKATE',
    'SKATEboard',
  ),
  usdc: new ERC20Token(
    17000,
    '0x42e87bddd77b0c4122b5dd4a8c62872610dcefef',
    6,
    'USDC',
    'USD Coin',
  )
}
