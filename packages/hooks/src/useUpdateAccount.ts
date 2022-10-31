import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'
import useIPFSUploader from './useIPFSUploader'
import { formatSocial } from './utils/formatSocial'

gql`
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      account {
        address
      }
    }
  }
`

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
 * @param uploadUrl - Url to use to upload file
 * @returns [
 *   updateFunction -- Function to update the account's profile
 *   { loading } -- Loading state
 * ]
 */
export default function useUpdateAccount(
  signer: Signer | undefined,
  { uploadUrl }: { uploadUrl: string },
): [(_: AccountInput) => Promise<string>, { loading: boolean }] {
  const { sdk } = useContext(LiteflowContext)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadFile] = useIPFSUploader(uploadUrl)

  const updateAccount = useCallback(
    async (inputs: AccountInput) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const account = await signer.getAddress()

      setLoading(true)
      try {
        const [imageIpfsHash, coverIpfsHash] = await Promise.all([
          inputs.image ? uploadFile(inputs.image) : undefined,
          inputs.cover ? uploadFile(inputs.cover) : undefined,
        ])
        const { updateAccount } = await sdk.UpdateAccount({
          input: {
            clientMutationId: null,
            address: account.toLowerCase(),
            patch: {
              image: imageIpfsHash ? `ipfs://${imageIpfsHash}` : null,
              cover: coverIpfsHash ? `ipfs://${coverIpfsHash}` : null,
              name: inputs.name || null,
              description: inputs.description || null,
              email: inputs.email || null,
              twitter: formatSocial(inputs.twitter) || null,
              instagram: formatSocial(inputs.instagram) || null,
              website: inputs.website || null,
              username: inputs.username || null,
              discord: inputs.discord || null,
            },
          },
        })
        invariant(updateAccount?.account, ErrorMessages.ACCOUNT_UPDATE_FAILED)
        return updateAccount.account.address
      } finally {
        setLoading(false)
      }
    },
    [sdk, signer, uploadFile],
  )
  return [updateAccount, { loading }]
}
