import decode, { JwtPayload } from 'jwt-decode'
import { gql, GraphQLClient } from 'graphql-request'
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Config, Sdk } from './graphql'
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
  config: Promise<Config>
}

export type LiteflowProviderProps = {
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
  config: {} as Promise<Config>,
})

export function LiteflowProvider({
  endpoint,
  children,
}: PropsWithChildren<LiteflowProviderProps>): JSX.Element {
  const [authenticationToken, setAuthenticationToken] = useState<string>()
  const client = useMemo(() => new GraphQLClient(endpoint), [endpoint])
  const sdk = useMemo(() => getSdk(client), [client])
  const config = useMemo(
    () => sdk.GetConfig().then(({ config }) => config),
    [sdk],
  )
  const currentAddress = useMemo(() => {
    if (!authenticationToken) return null
    const res = decode<JwtPayload & { address: string }>(authenticationToken)
    console.log(res.address)
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
        config,
      }}
    >
      {children}
    </LiteflowContext.Provider>
  )
}
