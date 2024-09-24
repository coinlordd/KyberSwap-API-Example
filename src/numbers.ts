import numbro from 'numbro'

export function toNumeric(n: string): number {
  const parsed = +n
  return isNaN(parsed) ? 0 : parsed
}

export function formatDollarAmount(num: number | string | undefined, digits = 2) {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }

  if (num === 0) return '$0.00'
  if (!num) return '-'
  if (num < 0.001 && digits <= 3) {
    return '<$0.001'
  }

  return Intl.NumberFormat('en-US', {
    notation: num < 10_000_000 ? 'standard' : 'compact',
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: num > 1000 ? 2 : digits,
  })
    .format(num)
    .toLowerCase()
}

export function formatAmount(num: number | string | undefined, digits?: number) {
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  if (num === 0) return '0'
  if (!num) return '-'

  if (num > 0 && num < 0.01) {
    return '<0.01'
  }
  if (num < 0 && num > -0.01) {
    return '<0.01'
  }

  // make sure the digits (in this case 2) is gte to the
  // decimals places of the sanity check earlier above
  const mantissa = digits || (num > 1000 ? 0 : 2)

  return numbro(num).format({
    thousandSeparated: true,
    mantissa: mantissa,
  })
}
