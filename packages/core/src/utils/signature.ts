import type { TypedDataSigner } from '@ethersproject/abstract-signer'
import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { EIP712Data } from '../types'

export function signEIP712(
  signer: Signer,
  eip712Data: EIP712Data,
): Promise<string> {
  const { domain, types, message } = eip712Data
  delete types.EIP712Domain // Hack: remove primary type from types to allow ethers detect the main type "Order" (aka: primaryType)
  invariant(
    (signer as unknown as TypedDataSigner)._signTypedData,
    'Signer does not support EIP712',
  )
  return (signer as unknown as TypedDataSigner)._signTypedData(
    domain,
    types,
    message,
  )
}
