import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import { LiteflowContext } from './context'

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
    if (!signer) throw new Error('signer falsy')
    try {
      setLoading(true)
      const account = await signer.getAddress()

      const data = await sdk.VerifyAccount({
        input: {
          clientMutationId: null,
          accountVerification: {
            accountAddress: account.toLowerCase(),
          },
        },
      })
      if (!data?.createAccountVerification?.accountVerification)
        throw new Error('data falsy')
      return data.createAccountVerification.accountVerification.status
    } finally {
      setLoading(false)
    }
  }, [sdk, signer])
  return [verifyAccount, { loading }]
}
