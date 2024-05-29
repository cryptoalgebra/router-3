import { ERC20Token } from '@pancakeswap/sdk'
import { ChainId } from '../chains/src'

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
  t1: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0x46854e78e4034e780d6e41a717d0f8acac71631a',
    8,
    'T1',
    'T1',
  ),
  tt2: new ERC20Token(
    ChainId.XLAYER_TESTNET,
    '0xd38b4cba041aaf2b69148a3e92c6f11db250ebe8',
    18,
    'TT2',
    'TT2'
  )
}
