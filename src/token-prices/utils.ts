import { ChainIdToChainName, SupportedChainId, TOKEN_PRICES_BASE_URL } from '../constants'

export function getTokenPricesBaseURL(chainId: SupportedChainId): string {
  return `${TOKEN_PRICES_BASE_URL}/${ChainIdToChainName[chainId]}/api/v1/prices`
}
