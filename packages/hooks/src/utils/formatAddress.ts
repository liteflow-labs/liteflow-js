import { getAddress, isAddress } from '@ethersproject/address'

export const formatAddress = (
  address: string | undefined,
  length = 10,
): string => {
  if (!address) return ''
  if (!isAddress(address)) return ''
  const parsed = getAddress(address)
  const chars = (length - 2) / 2
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}
