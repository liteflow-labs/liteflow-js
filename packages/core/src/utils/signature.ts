import type { Hex } from 'viem'
import type { EIP712Data, Signer } from '../types'

export function signEIP712(
  signer: Signer,
  eip712Data: EIP712Data,
): Promise<Hex> {
  return signer.signTypedData(eip712Data)
}
