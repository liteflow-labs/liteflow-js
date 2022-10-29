import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorCodes } from './error'
import useConfig from './useConfig'

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
  const config = useConfig()
  const [accepting, setAccepting] = useState(false)
  const [creating, setCreating] = useState(false)
  const create = useCallback(async () => {
    invariant(
      (await config).hasReferralSystem,
      ErrorCodes.FEATURE_DISABLED_REFERRAL,
    )
    invariant(signer, ErrorCodes.SIGNER_FALSY)
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
        ErrorCodes.INVITATION_CREATION_FAILED,
      )

      return createInvitation.invitation.id
    } finally {
      setCreating(false)
    }
  }, [sdk, signer, config])

  const accept = useCallback(
    async (invitationId: string) => {
      invariant(
        (await config).hasReferralSystem,
        ErrorCodes.FEATURE_DISABLED_REFERRAL,
      )
      try {
        setAccepting(true)
        const { acceptInvitation } = await sdk.AcceptInvitation({
          id: invitationId,
        })
        invariant(acceptInvitation?.invitation, ErrorCodes.INVITATION_NOT_FOUND)
        return acceptInvitation.invitation.id
      } finally {
        setAccepting(false)
      }
    },
    [sdk, config],
  )

  return { create, accept, accepting, creating }
}
