import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorCodes } from './error'

gql`
  mutation VerifyAccount($input: CreateAccountVerificationInput!) {
    createAccountVerification(input: $input) {
      accountVerification {
        status
      }
    }
  }
`

/**
 * Hook to ask to verify an account.
 * @returns [
 *   verifyAccount -- Function to verify the account
 *   { loading } -- Loading state
 * ]
 */
export default function useVerifyAccount(
  signer: Signer | undefined,
): [() => Promise<string>, { loading: boolean }] {
  const { sdk } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)

  const verifyAccount = useCallback(async () => {
    invariant(signer, ErrorCodes.SIGNER_FALSY)
    try {
      setLoading(true)
      const account = await signer.getAddress()

      const { createAccountVerification } = await sdk.VerifyAccount({
        input: {
          clientMutationId: null,
          accountVerification: {
            accountAddress: account.toLowerCase(),
          },
        },
      })
      invariant(
        createAccountVerification?.accountVerification,
        ErrorCodes.ACCOUNT_VERIFICATION_FAILED,
      )
      return createAccountVerification.accountVerification.status
    } finally {
      setLoading(false)
    }
  }, [sdk, signer])
  return [verifyAccount, { loading }]
}
