import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '../chains/src'


export const holeskyTokens = {
  usdt: new ERC20Token(
    ChainId.KAKAROT_SEPOLIA,
    '0x2BF1004D9e80ca087BD1e089d75bc8c471995aC1',
    6,
    'kUSDT',
    'kUSDT',
  ),
  weth: new ERC20Token(
    ChainId.KAKAROT_SEPOLIA,
    '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    18,
    'WETH',
    'WETH',
  ),
}
