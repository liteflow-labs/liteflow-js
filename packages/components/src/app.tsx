import { ApolloProvider, NormalizedCacheObject } from '@apollo/client'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { ChakraProvider } from '@chakra-ui/react'
import { Dict } from '@chakra-ui/utils'
import { Web3Provider } from '@ethersproject/providers'
import { LiteflowProvider } from '@nft/hooks'
import { Web3ReactProvider } from '@web3-react/core'
import React, {
  ComponentType,
  Fragment,
  PropsWithChildren,
  useMemo,
} from 'react'
import { CookiesProvider } from 'react-cookie'
import Cookies from 'universal-cookie'
import { getAndEnrichClient } from './client'
import Session, {
  COOKIE_ADDRESS,
  COOKIE_JWT_TOKEN,
  Props as SessionProps,
} from './session'

type Props = PropsWithChildren<
  {
    endpointUri: string
    ssr: boolean
    cache: NormalizedCacheObject
    user?: {
      address?: string
      token?: string
    }
    theme: Dict
    bugsnagAPIKey?: string
  } & SessionProps
>

function web3Provider(provider: any): Web3Provider {
  return new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any',
  )
}

export default function LiteflowNFTApp({
  endpointUri,
  ssr,
  cache,
  user,
  theme,
  bugsnagAPIKey,
  children,
  ...sessionProps
}: Props): JSX.Element {
  const cookies = useMemo(() => {
    const res: { [key: string]: string } = {}
    if (user?.address) {
      res[COOKIE_ADDRESS] = user.address
      if (user.token) res[COOKIE_JWT_TOKEN(user.address)] = user.token
    }
    return res
  }, [user])
  const client = useMemo(
    () => getAndEnrichClient(endpointUri, ssr, cookies, cache),
    [endpointUri, ssr, cookies, cache],
  )

  if (bugsnagAPIKey) {
    Bugsnag.start({
      apiKey: bugsnagAPIKey,
      plugins: [new BugsnagPluginReact(React)],
    })
  }
  const ErrorBoundary = bugsnagAPIKey
    ? (Bugsnag.getPlugin('react')?.createErrorBoundary(React) as ComponentType)
    : Fragment

  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <ApolloProvider client={client}>
          <Web3ReactProvider getLibrary={web3Provider}>
            <CookiesProvider cookies={ssr ? new Cookies(cookies) : undefined}>
              <LiteflowProvider endpoint={endpointUri}>
                <Session {...sessionProps}>{children}</Session>
              </LiteflowProvider>
            </CookiesProvider>
          </Web3ReactProvider>
        </ApolloProvider>
      </ChakraProvider>
    </ErrorBoundary>
  )
}
