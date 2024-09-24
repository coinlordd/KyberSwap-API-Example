import { mainnet, bsc, fantom, arbitrum, optimism, base } from 'viem/chains'
import JSBI from 'jsbi'

export const SupportedChains = [mainnet, bsc, fantom, arbitrum, optimism, base] as const
export type SupportedChainId = (typeof SupportedChains)[number]['id']

export type BytesLike = `0x${string}`

export const ChainIdToChainName: { [chainId in SupportedChainId]: string } = {
  [arbitrum.id]: 'arbitrum',
  [base.id]: 'base',
  [bsc.id]: 'bsc',
  [fantom.id]: 'fantom',
  [mainnet.id]: 'ethereum',
  [optimism.id]: 'optimism',
}

export const AGGREGATOR_BASE_URL = 'https://aggregator-api.kyberswap.com'
export const TOKEN_PRICES_BASE_URL = 'https://price.kyberswap.com'

export const ETHER_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const BIPS_BASE = JSBI.BigInt(10_000)
export const RESERVE_USD_DECIMALS = 100
export const BI_ZERO = JSBI.BigInt(0)
