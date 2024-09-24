import { Currency, CurrencyAmount, Price } from '@kyberswap/ks-sdk-core'
import { z } from 'zod'

/** ---------------------------
 *        Final Types
 * --------------------------*/

export enum ChargeFeeBy {
  CURRENCY_IN = 'currency_in',
  CURRENCY_OUT = 'currency_out',
  NONE = '',
}

type ExtraFeeConfig = {
  feeAmount: string
  feeAmountUsd?: string
  chargeFeeBy: ChargeFeeBy
  isInBps: boolean
  feeReceiver: string
}

type Route = {
  pool: string

  tokenIn: string
  swapAmount: string

  tokenOut: string
  amountOut: string

  limitReturnAmount: string
  exchange: string
  poolLength: number
  poolType: string
}

export type DetailedRouteSummary = {
  tokenIn: string
  amountIn: string
  parsedAmountIn: CurrencyAmount<Currency>
  amountInUsd: string

  tokenOut: string
  amountOut: string
  parsedAmountOut: CurrencyAmount<Currency>
  amountOutUsd: string

  priceImpact: number
  executionPrice: Price<Currency, Currency>

  gas: string
  gasUsd: string
  gasPrice: string

  fee?: {
    currency: Currency
    currencyAmount: CurrencyAmount<Currency>
    formattedAmount: string
    formattedAmountUsd: string
  }

  extraFee: ExtraFeeConfig

  route: Route[][]
  routerAddress: string
}

/** ---------------------------
 *    Zod Types for Parsing
 * --------------------------*/

const Route = z.object({
  pool: z.string(),

  tokenIn: z.string(),
  swapAmount: z.string(),

  tokenOut: z.string(),
  amountOut: z.string(),

  limitReturnAmount: z.string(),
  exchange: z.string(),
  poolLength: z.number(),
  poolType: z.string(),
})

const Fee = z.object({
  feeAmount: z.string(),
  feeAmountUsd: z.string().optional(),
  chargeFeeBy: z.nativeEnum(ChargeFeeBy),
  isInBps: z.boolean(),
  feeReceiver: z.string(),
})

const RouteSummary = z.object({
  tokenIn: z.string(),
  amountIn: z.string(),
  amountInUsd: z.string(),

  tokenOut: z.string(),
  amountOut: z.string(),
  amountOutUsd: z.string(),

  gas: z.string(),
  gasUsd: z.string(),
  gasPrice: z.string(),

  extraFee: Fee,
  route: z.array(z.array(Route)),
})

export const RouteSummaryResponse = z.object({
  data: z.object({
    routeSummary: RouteSummary,
    routerAddress: z.string(),
  }),
})

export type RouteSummaryResponse = z.infer<typeof RouteSummaryResponse>
