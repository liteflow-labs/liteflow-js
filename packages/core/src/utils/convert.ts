import type { Address, ChainId, TransactionHash } from '../types'

export function toAddress(address: string): Address {
  return `0x${address.toLowerCase().replace(/^0x/, '')}`
}

export function toTransactionHash(hash: string): TransactionHash {
  return `0x${hash.toLowerCase().replace(/^0x/, '')}`
}

export function toId(keys: (string | undefined | null)[]): string {
  return keys.filter(Boolean).join('-')
}

export function toAssetId(
  chainId: ChainId,
  address: Address,
  token: string,
): string {
  return toId([chainId.toString(), address, token])
}

export function toCurrencyId(
  chainId: ChainId,
  address: Address | null,
): string {
  return toId([chainId.toString(), address])
}
