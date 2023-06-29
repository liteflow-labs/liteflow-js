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
  chain: ChainId,
  address: Address,
  token: string,
): string {
  return toId([chain.toString(), address, token])
}

export function toCurrencyId(chain: ChainId, address: Address | null): string {
  return toId([chain.toString(), address])
}
