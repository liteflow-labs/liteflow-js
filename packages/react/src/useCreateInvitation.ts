import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

gql`
  mutation CreateInvitation {
    createInvitation(input: {}) {
      invitation {
        id
      }
    }
  }
`

gql`
  query GetInvitation($address: Address!) {
    invitationByInvitedByAddress(invitedByAddress: $address) {
      id
    }
  }
`

export default function useCreateInvitation(signer: Signer | undefined): {
  create: () => Promise<string>
  creating: boolean
} {
  const { sdk } = useContext(LiteflowContext)
  const [creating, setCreating] = useState(false)

  const create = useCallback(async () => {
    invariant(signer, ErrorMessages.SIGNER_FALSY)
    try {
      setCreating(true)
      const account = await signer.getAddress()
      const { invitationByInvitedByAddress } = await sdk.GetInvitation({
        address: account.toLowerCase(),
      })
      if (invitationByInvitedByAddress) return invitationByInvitedByAddress.id
      const { createInvitation } = await sdk.CreateInvitation()
      invariant(
        createInvitation?.invitation?.id,
        ErrorMessages.INVITATION_CREATION_FAILED,
      )

      return createInvitation.invitation.id
    } finally {
      setCreating(false)
    }
  }, [sdk, signer])

  return { create, creating }
}
