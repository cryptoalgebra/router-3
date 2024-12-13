import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '../chains/src'

export const sonicTestnetTokens = {
  ws: new ERC20Token(
    ChainId.SONIC_TESTNET,
    '0x845e4145F7de2822d16FE233Ecd0181c61f1d65F',
    18,
    'WS',
    'WS'
  ),
  usdt: new ERC20Token(
    ChainId.SONIC_TESTNET,
    '0x2cC8Bd37EBB051A9126D34b9b3f4431CF6263Db6',
    18,
    'USDT',
    'USDT'
  ),
  swpx: new ERC20Token(
    ChainId.SONIC_TESTNET,
    '0xeFa92Da8244c506BaFaf79e823a7aF129C37f6d9',
    18,
    'SWPX',
    'SWPX'
  ),
}

export const xLayerTestnetTokens = {
  wokb: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x87a851c652e5d772ba61ec320753c6349bb3c1e3',
    18,
    'WOKB',
    'WOKB',
  ),
  weth: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xbec7859bc3d0603bec454f7194173e36bf2aa5c8',
    18,
    'WETH',
    'WETH',
  ),
  usdt: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x62a698e0b600251318bd5265089baec10fb13c8f',
    18,
    'USDT',
    'USDT',
  ),
  tether: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x3b67625d24700de25c46a2cf8eaec453f9215923',
    18,
    'USDT',
    'Tether'
  ),
  usdcCoin: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xa5b0ca7d49cb4228a511af6124e753997ec57115',
    18,
    'USDC',
    'USDC Coin'
  ),
  wrappedEther: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xace5ca1a8badbe1764a8fd444f1a7e8a6870b9c7',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  loki: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xebe9a6f19fff4099bdb1db604883e8ff27eb1ca2',
    18,
    'LOKI',
    'Loki'
  ),
  thor: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xacfa500786304c99563dfb43886456389bc8a1b6',
    18,
    'THOR',
    'Thor'
  ),
  ironman: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x6463514c8ab0346910172ee6c183f8c572c6ee84',
    18,
    'IRON',
    'Ironman'
  ),
  hulk: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xc76d38cc36bf53816d91e955b92625ef9dac6cb3',
    18,
    'HULK',
    'Hulk'
  ),
}
