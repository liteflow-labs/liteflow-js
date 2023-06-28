import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import invariant from 'ts-invariant'
import { LiteflowContext } from './context'
import { ErrorMessages } from './errorMessages'

gql`
  mutation RequestAuthentication($input: RequestAuthenticationInput!) {
    requestAuthentication(input: $input) {
      message
      parameters {
        address
        issuedAt
        expirationTime
        nonce
      }
    }
  }
`

gql`
  mutation Authenticate($input: AuthenticateInput!) {
    authenticate(input: $input) {
      jwtToken
    }
  }
`

export default function useAuthenticate(): [
  (signer: Signer) => Promise<{ accountAddress: string; jwtToken: string }>,
  {
    loading: boolean
    setAuthenticationToken: (token: string) => void
    resetAuthenticationToken: () => void
  },
] {
  const { sdk, setAuthenticationToken, resetAuthenticationToken } =
    useContext(LiteflowContext)
  const [loading, setLoading] = useState(false)

  const authenticate = useCallback(
    async (signer: Signer) => {
      invariant(signer, ErrorMessages.SIGNER_FALSY)
      const address = (await signer.getAddress()).toLowerCase()

      try {
        resetAuthenticationToken()
        setLoading(true)
        // request message
        const { requestAuthentication } = await sdk.RequestAuthentication({
          input: {
            clientMutationId: null,
            address,
          },
        })

        // sign message
        const signature = await signer.signMessage(
          requestAuthentication.message,
        )

        // authenticate against the API
        const authenticateData = await sdk.Authenticate({
          input: {
            clientMutationId: null,
            signature,
            parameters: {
              address: requestAuthentication.parameters.address,
              expirationTime: requestAuthentication.parameters.expirationTime,
              issuedAt: requestAuthentication.parameters.issuedAt,
              nonce: requestAuthentication.parameters.nonce,
            },
          },
        })
        setAuthenticationToken(authenticateData.authenticate.jwtToken)
        return {
          accountAddress: address,
          jwtToken: authenticateData.authenticate.jwtToken,
        }
      } finally {
        setLoading(false)
      }
    },
    [sdk, setAuthenticationToken, resetAuthenticationToken],
  )

  return [
    authenticate,
    { loading, setAuthenticationToken, resetAuthenticationToken },
  ]
}
