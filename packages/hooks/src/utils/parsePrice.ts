import { BigNumber } from '@ethersproject/bignumber'
import { BigNumber as BN } from 'bignumber.js'

export const parsePrice = (
  price: string | undefined,
  decimals: number,
): BigNumber => {
  if (!price) return BigNumber.from(0)
  try {
    return BigNumber.from(new BN(price).shiftedBy(decimals).toFixed(0))
  } catch {
    console.error(`Cannot parse price ${price} as BigNumber`)
    return BigNumber.from(0)
  }
}
