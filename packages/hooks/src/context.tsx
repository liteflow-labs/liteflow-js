import { Client } from '@liteflow/core'
import { gql, GraphQLClient } from 'graphql-request'
import decode, { JwtPayload } from 'jwt-decode'
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import invariant from 'ts-invariant'
import type { Sdk } from './graphql'
import { getSdk } from './graphql'

gql`
  query GetConfig {
    config {
      hasLazyMint
      hasReferralSystem
      hasSocialFeatures
      hasTopUp
      hasUnlockableContent
    }
  }
`

export type LiteflowContext = {
  setAuthenticationToken: (token: string) => void
  resetAuthenticationToken: () => void
  currentAddress: string | null
  sdk: Sdk
  client: Client
}

export type LiteflowProviderProps = {
  endpoint: string
}

const uuidRegEx =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}/g

export const LiteflowContext = createContext<LiteflowContext>({
  setAuthenticationToken(_token) {
    throw new Error('not implemented')
  },
  resetAuthenticationToken() {
    throw new Error('not implemented')
  },
  currentAddress: null,
  sdk: {} as Sdk,
  client: {} as Client,
})

export function LiteflowProvider({
  endpoint,
  children,
}: PropsWithChildren<LiteflowProviderProps>): JSX.Element {
  const [authenticationToken, setAuthenticationToken] = useState<string>()
  const client = useMemo(() => new GraphQLClient(endpoint), [endpoint])
  const coreClient = useMemo(() => {
    const url = new URL(endpoint)
    const [apiKey] = url.pathname.match(uuidRegEx) || []
    invariant(apiKey, 'invalid endpoint')
    return new Client(apiKey, {
      authorization: authenticationToken,
      endpoint: new URL(`${url.protocol}//${url.host}`),
    })
  }, [endpoint, authenticationToken])
  const sdk = useMemo(() => getSdk(client), [client])
  const currentAddress = useMemo(() => {
    if (!authenticationToken) return null
    const res = decode<JwtPayload & { address: string }>(authenticationToken)
    if (res.exp && res.exp < Math.ceil(Date.now() / 1000)) return null
    return res.address
  }, [authenticationToken])

  const resetAuthenticationToken = useCallback(
    () => setAuthenticationToken(undefined),
    [setAuthenticationToken],
  )

  useEffect(() => {
    client.setHeaders(undefined)
    authenticationToken &&
      client.setHeader('Authorization', `Bearer ${authenticationToken}`)
    return () => {
      client.setHeaders(undefined)
    }
  }, [client, authenticationToken])

  return (
    <LiteflowContext.Provider
      value={{
        resetAuthenticationToken,
        setAuthenticationToken,
        currentAddress,
        sdk,
        client: coreClient,
      }}
    >
      {children}
    </LiteflowContext.Provider>
  )
}
