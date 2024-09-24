import JSBI from 'jsbi'
import { parseUnits } from 'viem'
import { Currency, CurrencyAmount, Fraction, TokenAmount } from '@kyberswap/ks-sdk-core'

import { RouteSummaryResponse, DetailedRouteSummary, ChargeFeeBy } from './types'
import { formatAmount, formatDollarAmount } from '../numbers'
import {
  SupportedChainId,
  BIPS_BASE,
  RESERVE_USD_DECIMALS,
  ChainIdToChainName,
  AGGREGATOR_BASE_URL,
} from '../constants'

export function getAggregatorBaseURL(chainId: SupportedChainId): string {
  return `${AGGREGATOR_BASE_URL}/${ChainIdToChainName[chainId]}/api/v1/routes`
}

export function toCurrencyAmount(currency: Currency, value: string | number): CurrencyAmount<Currency> {
  try {
    return TokenAmount.fromRawAmount(currency, JSBI.BigInt(value))
  } catch (e) {
    return TokenAmount.fromRawAmount(currency, 0)
  }
}

export function calculatePriceImpact(amountInUsd: number, amountOutUsd: number): number {
  const priceImpact = !amountOutUsd ? NaN : ((amountInUsd - amountOutUsd) * 100) / amountInUsd
  return priceImpact
}

export function calculateFee(
  parsedAmountIn: CurrencyAmount<Currency>,
  parsedAmountOut: CurrencyAmount<Currency>,
  routeSummary: RouteSummaryResponse['data']['routeSummary']
): DetailedRouteSummary['fee'] {
  if (!routeSummary.extraFee?.chargeFeeBy || !routeSummary.extraFee?.feeAmount) {
    return undefined
  }

  const currencyAmountToTakeFee =
    routeSummary.extraFee.chargeFeeBy === ChargeFeeBy.CURRENCY_IN ? parsedAmountIn : parsedAmountOut
  const feeAmountFraction = new Fraction(
    parseUnits(routeSummary.extraFee.feeAmount, RESERVE_USD_DECIMALS).toString(),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(RESERVE_USD_DECIMALS))
  ).divide(BIPS_BASE)

  const feeCurrencyAmount = routeSummary.extraFee.isInBps
    ? currencyAmountToTakeFee.multiply(feeAmountFraction)
    : CurrencyAmount.fromRawAmount(currencyAmountToTakeFee.currency, routeSummary.extraFee.feeAmount)

  const feeAmountUsd = routeSummary.extraFee.feeAmountUsd
  return {
    currency: currencyAmountToTakeFee.currency,
    currencyAmount: feeCurrencyAmount,
    formattedAmount: formatAmount(feeCurrencyAmount.toSignificant(RESERVE_USD_DECIMALS)),
    formattedAmountUsd: feeAmountUsd && feeAmountUsd !== '0' ? formatDollarAmount(feeAmountUsd, 4) : '',
  }
}
