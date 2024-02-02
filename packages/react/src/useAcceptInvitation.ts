import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

gql`
  mutation AcceptInvitation($id: UUID!) {
    acceptInvitation(input: { id: $id }) {
      invitation {
        id
      }
    }
  }
`

export default function useAcceptInvitation(): {
  accept: (invitationId: string) => Promise<string>
  accepting: boolean
} {
  const { sdk } = useContext(LiteflowContext)
  const [accepting, setAccepting] = useState(false)

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

  return { accept, accepting }
}
