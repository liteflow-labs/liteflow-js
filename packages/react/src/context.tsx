import { Client } from '@liteflow/core'
import { GraphQLClient } from 'graphql-request'
import decode, { JwtPayload } from 'jwt-decode'
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Sdk } from './graphql'
import { getSdk } from './graphql'

export type LiteflowContext = {
  setAuthenticationToken: (token: string) => void
  resetAuthenticationToken: () => void
  currentAddress: string | null
  sdk: Sdk
  client: Client
}

export type LiteflowProviderProps = {
  apiKey: string
  endpoint: string
}

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
  apiKey,
  endpoint = 'https://api.liteflow.com',
  children,
}: PropsWithChildren<LiteflowProviderProps>): JSX.Element {
  const [authenticationToken, setAuthenticationToken] = useState<string>()
  const client = useMemo(
    () => new GraphQLClient(`${endpoint}/${apiKey}/graphql`),
    [endpoint, apiKey],
  )
  const coreClient = useMemo(
    () =>
      new Client(apiKey, {
        authorization: authenticationToken,
        endpoint: new URL(endpoint),
      }),
    [endpoint, apiKey, authenticationToken],
  )
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
