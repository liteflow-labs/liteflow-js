import { Signer } from '@liteflow/core'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

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
  const { client } = useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)

  const verifyAccount = useCallback(async () => {
    invariant(signer, ErrorMessages.SIGNER_FALSY)
    try {
      setLoading(true)
      const status = await client.account.verify(signer)
      return status
    } finally {
      setLoading(false)
    }
  }, [client.account, signer])
  return [verifyAccount, { loading }]
}
