import { Signer } from '@ethersproject/abstract-signer'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

type AccountInput = {
  image?: File | string
  cover?: File | string
  name?: string
  description?: string
  email?: string
  twitter?: string
  instagram?: string
  website?: string
  username?: string
  discord?: string
}

/**
 * Hook to update an account's profile and upload images to IPFS.
 * @returns [
 *   updateFunction -- Function to update the account's profile
 *   { loading } -- Loading state
 * ]
 */
export default function useUpdateAccount(
  signer: Signer | undefined,
): [(_: AccountInput) => Promise<string>, { loading: boolean }] {
  const { client } = useContext(LiteflowContext)
  const [loading, setLoading] = useState<boolean>(false)

  const updateAccount = useCallback(
    async (inputs: AccountInput) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      setLoading(true)
      try {
        const address = await client.account.update(inputs, signer)
        return address
      } finally {
        setLoading(false)
      }
    },
    [client, signer],
  )
  return [updateAccount, { loading }]
}
