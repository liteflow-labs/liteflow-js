import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import { LiteflowContext } from './context'

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
    if (!signer) throw new Error('signer falsy')
    try {
      setCreating(true)
      const account = await signer.getAddress()
      const invite = await sdk.GetInvitation({
        address: account.toLowerCase(),
      })
      if (invite.invitationByInvitedByAddress) {
        return invite.invitationByInvitedByAddress.id
      }
      const data = await sdk.CreateInvitation()
      if (!data?.createInvitation?.invitation?.id) throw new Error('No id')

      return data.createInvitation.invitation.id
    } finally {
      setCreating(false)
    }
  }, [sdk, signer])

  const accept = useCallback(
    async (invitationId: string) => {
      try {
        setAccepting(true)
        const data = await sdk.AcceptInvitation({ id: invitationId })
        if (!data?.acceptInvitation?.invitation)
          throw new Error('No invitation')
        return data.acceptInvitation.invitation.id
      } finally {
        setAccepting(false)
      }
    },
    [sdk],
  )

  return { create, accept, accepting, creating }
}
