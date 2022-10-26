import { Signer } from '@ethersproject/abstract-signer'
import { gql } from 'graphql-request'
import { useCallback, useContext, useState } from 'react'
import { LiteflowContext } from './context'

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
      if (!signer) throw new Error('signer is falsy')
      const address = (await signer.getAddress()).toLowerCase()
      if (!address) throw new Error('address is falsy')

      try {
        resetAuthenticationToken()
        setLoading(true)
        // request message
        const requestAuthenticationData = await sdk.RequestAuthentication({
          input: {
            clientMutationId: null,
            address,
          },
        })
        if (!requestAuthenticationData?.requestAuthentication.message)
          throw new Error('unknown error during request of authentication data')
        const payload = requestAuthenticationData.requestAuthentication

        // sign message
        const signature = await signer.signMessage(payload.message)

        // authenticate against the API
        const authenticateData = await sdk.Authenticate({
          input: {
            clientMutationId: null,
            signature,
            parameters: {
              address: payload.parameters.address,
              expirationTime: payload.parameters.expirationTime,
              issuedAt: payload.parameters.issuedAt,
              nonce: payload.parameters.nonce,
            },
          },
        })
        if (!authenticateData?.authenticate?.jwtToken)
          throw new Error('unknown error during authenticate request')

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
