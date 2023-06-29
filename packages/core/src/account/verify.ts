import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { AccountVerificationStatus, Sdk } from '../graphql'
import { toAddress } from '../utils/convert'

export async function verify(
  sdk: Sdk,
  signer: Signer,
): Promise<AccountVerificationStatus> {
  const address = await signer.getAddress()

  const { createAccountVerification } = await sdk.VerifyAccount({
    input: {
      clientMutationId: null,
      accountVerification: {
        accountAddress: toAddress(address),
      },
    },
  })
  invariant(
    createAccountVerification?.accountVerification,
    'Account verification failed',
  )
  return createAccountVerification.accountVerification.status
}
