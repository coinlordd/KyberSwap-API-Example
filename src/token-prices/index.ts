import { Token } from '@kyberswap/ks-sdk-core'
import { SupportedChainId } from '../constants'
import { getTokenPricesBaseURL } from './utils'
import { TokenPricesResponse } from './types'

export async function getTokenPrices(chainId: SupportedChainId, tokens: Token[]) {
  try {
    // Fetch the data from the price api
    const data = await fetchTokenPrices_MayThrow(chainId, tokens)

    // Parse the incoming data
    const parsed = parseTokenPrices(data)
    return parsed
  } catch (error) {
    console.error(error)
    return undefined
  }
}

async function fetchTokenPrices_MayThrow(chainId: SupportedChainId, tokens: Token[]) {
  // Draft our payload
  const payload = {
    ids: tokens.map((token) => token.address).join(','),
  }

  // Build our URL
  const baseURL = getTokenPricesBaseURL(chainId)

  // Fetch the data from the price api
  const response = await fetch(baseURL, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const data = await response.json()

  // Return the data
  return data
}

function parseTokenPrices(data: any): TokenPricesResponse['data']['prices'] | undefined {
  if (!data) return undefined

  // Parse the data using Zod
  const parsed = TokenPricesResponse.safeParse(data)

  // Check if the parse was successful
  if (!parsed.success) {
    console.error('Error parsing token prices', parsed.error.message)
    return undefined
  }

  // Return the parsed data
  return parsed.data.data.prices
}
