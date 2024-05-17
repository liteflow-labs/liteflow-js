import { Signer } from '@liteflow/core'
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
  mutation AcceptInvitation($id: UUID!) {
    acceptInvitation(input: { id: $id }) {
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

export default function useInvitation(signer: Signer | undefined): {
  create: () => Promise<string>
  accept: (invitationId: string) => Promise<string>
  accepting: boolean
  creating: boolean
} {
  const { sdk } = useContext(LiteflowContext)
  const [accepting, setAccepting] = useState(false)
  const [creating, setCreating] = useState(false)
  const create = useCallback(async () => {
    invariant(signer, ErrorMessages.SIGNER_FALSY)
    try {
      setCreating(true)
      const account = signer.account.address
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

  const accept = useCallback(
    async (invitationId: string) => {
      try {
        setAccepting(true)
        const { acceptInvitation } = await sdk.AcceptInvitation({
          id: invitationId,
        })
        invariant(
          acceptInvitation?.invitation,
          ErrorMessages.INVITATION_NOT_FOUND,
        )
        return acceptInvitation.invitation.id
      } finally {
        setAccepting(false)
      }
    },
    [sdk],
  )

  return { create, accept, accepting, creating }
}
