import { BigNumber } from '@ethersproject/bignumber'
import { BigNumber as BN } from 'bignumber.js'

export const parseBigNumber = (
  value: string | undefined,
  decimals: number,
): BigNumber => {
  if (!value) return BigNumber.from(0)
  try {
    const valueBN = BigNumber.from(new BN(value).shiftedBy(decimals).toFixed(0))
    if (valueBN.lt(0)) {
      console.error('value is negative')
      return BigNumber.from(0)
    }
    return valueBN
  } catch {
    console.error(`Cannot parse value ${value} as BigNumber`)
    return BigNumber.from(0)
  }
}
