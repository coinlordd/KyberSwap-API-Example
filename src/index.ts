import { NativeCurrency, Token } from '@kyberswap/ks-sdk-core'
import { base } from 'viem/chains'

import { getRouteSummary } from './route-summary'
import { getTokenPrices } from './token-prices'

async function main() {
  const routeSummary = await getRouteSummary(base.id, BASE_ETH, BASE_USDC, '1')
  console.table({
    tokenIn: routeSummary?.tokenIn,
    tokenOut: routeSummary?.tokenOut,
    amountIn: routeSummary?.amountIn,
    amountInParsed: routeSummary?.parsedAmountIn.toSignificant(6),
    amountInUsd: routeSummary?.amountInUsd,
    amountOut: routeSummary?.amountOut,
    amountOutParsed: routeSummary?.parsedAmountOut.toSignificant(6),
    amountOutUsd: routeSummary?.amountOutUsd,
    priceImpact: `${routeSummary?.priceImpact.toFixed(6)} %`,
    executionPrice: routeSummary?.executionPrice.toSignificant(6),
    gas: routeSummary?.gas,
    gasUsd: routeSummary?.gasUsd,
    gasPrice: routeSummary?.gasPrice,
    fee: routeSummary?.fee,
  })

  const tokenPrices = await getTokenPrices(base.id, [BASE_WETH, BASE_USDC])
  if (!tokenPrices) return

  console.table(
    tokenPrices.map((price) => ({
      Address: price.address,
      Price: price.price,
    }))
  )
}

const BASE_USDC = new Token(base.id, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 6, 'USDC', 'USD Coin')
const BASE_WETH = new Token(base.id, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped ETH')
const BASE_ETH = new NativeCurrency(base.id, 18, 'ETH', 'Ethereum')

main()
