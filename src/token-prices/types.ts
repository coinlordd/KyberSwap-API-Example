import { z } from 'zod'

export const TokenPricesResponse = z.object({
  message: z.string(),
  data: z.object({
    prices: z.array(
      z.object({
        address: z.string(),
        price: z.number(),
        marketPrice: z.number(),
        preferPriceSource: z.string(),
      })
    ),
  }),
})

export type TokenPricesResponse = z.infer<typeof TokenPricesResponse>
