import { Currency, Price } from '@kyberswap/ks-sdk-core'
import BigNumber from 'bignumber.js'

import { AGGREGATOR_BASE_URL, ChainIdToChainName, ETHER_ADDRESS, SupportedChainId } from '../constants'
import { DetailedRouteSummary, RouteSummaryResponse } from './types'
import { calculateFee, calculatePriceImpact, getAggregatorBaseURL, toCurrencyAmount } from './utils'

export async function getRouteSummary(
  chainId: SupportedChainId,
  currencyIn: Currency,
  currencyOut: Currency,
  amountIn: string
): Promise<DetailedRouteSummary | undefined> {
  try {
    // Fetch the route summary
    const data = await fetchRouteSummary_MayThrow(chainId, currencyIn, currencyOut, amountIn)

    // Parse the incoming data
    const parsed = parseRouteSummary(data)
    if (!parsed) return undefined

    // Build the detailed route summary
    const detailedRouteSummary = buildDetailedRouteSummary(
      parsed.routeSummary,
      parsed.routerAddress,
      currencyIn,
      currencyOut
    )

    return detailedRouteSummary
  } catch (error) {
    console.error(error)
    return undefined
  }
}

async function fetchRouteSummary_MayThrow(
  chainId: SupportedChainId,
  currencyIn: Currency,
  currencyOut: Currency,
  amountIn: string
) {
  // Draft our params
  const tokenInAddress = currencyIn.isNative ? ETHER_ADDRESS : currencyIn.wrapped.address
  const tokenOutAddress = currencyOut.isNative ? ETHER_ADDRESS : currencyOut.address
  const amount = new BigNumber(amountIn).shiftedBy(currencyIn.decimals).toFixed(0) // `0` prevents scientific notation

  // Build our URL
  const baseURL = getAggregatorBaseURL(chainId)
  const url =
    baseURL +
    '?' +
    new URLSearchParams({
      tokenIn: tokenInAddress,
      tokenOut: tokenOutAddress,
      amountIn: amount,
      gasInclude: 'true',
    })

  // Fetch the data from the aggregator
  const response = await fetch(url)
  const data = await response.json()

  // Return the data
  return data
}

function parseRouteSummary(data: any): RouteSummaryResponse['data'] | undefined {
  if (!data) return undefined

  // Parse the data using Zod
  const parsed = RouteSummaryResponse.safeParse(data)

  // Check if the parse was successful
  if (!parsed.success) {
    console.error('Error parsing route summary', parsed.error.message)
    return undefined
  }

  // Return the parsed data
  return parsed.data.data
}

function buildDetailedRouteSummary(
  parsedRouteSummary: RouteSummaryResponse['data']['routeSummary'],
  parsedRouterAddress: RouteSummaryResponse['data']['routerAddress'],
  currencyIn: Currency,
  currencyOut: Currency
): DetailedRouteSummary | undefined {
  const isValidPair =
    parsedRouteSummary.tokenIn.toLowerCase() ===
      (currencyIn.isNative ? ETHER_ADDRESS : currencyIn.wrapped.address).toLowerCase() &&
    parsedRouteSummary.tokenOut.toLowerCase() ===
      (currencyOut.isNative ? ETHER_ADDRESS : currencyOut.wrapped.address).toLowerCase()

  if (!isValidPair) return undefined

  const parsedAmountIn = toCurrencyAmount(currencyIn, parsedRouteSummary.amountIn)
  const parsedAmountOut = toCurrencyAmount(currencyOut, parsedRouteSummary.amountOut)
  const executionPrice = new Price(
    parsedAmountIn.currency,
    parsedAmountOut.currency,
    parsedAmountIn.quotient,
    parsedAmountOut.quotient
  )

  return {
    ...parsedRouteSummary,
    parsedAmountIn,
    parsedAmountOut,
    fee: calculateFee(parsedAmountIn, parsedAmountOut, parsedRouteSummary),
    priceImpact: calculatePriceImpact(Number(parsedRouteSummary.amountInUsd), Number(parsedRouteSummary.amountOutUsd)),
    executionPrice,
    routerAddress: parsedRouterAddress,
  }
}
