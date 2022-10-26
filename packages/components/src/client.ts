import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  OperationVariables,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import decode, { JwtPayload } from 'jwt-decode'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import Cookies from 'universal-cookie'
import { COOKIE_ADDRESS, COOKIE_JWT_TOKEN } from './session'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let _client: ApolloClient<NormalizedCacheObject> | undefined = undefined

export function getClient(
  uri: string,
  ssrMode: boolean,
  cookies: NextApiRequestCookies | undefined,
): ApolloClient<NormalizedCacheObject> {
  const httpLink = createHttpLink({
    uri,
  })

  // this function is called every time apollo is making a request
  const authLink = setContext((_, context) => {
    const c = new Cookies(cookies)

    const currentAddress = c.get(COOKIE_ADDRESS)
    if (!currentAddress) return context

    const jwtToken = c.get(COOKIE_JWT_TOKEN(currentAddress))
    if (!jwtToken) return context

    // check expiration of jwt token
    const res = decode<JwtPayload>(jwtToken)
    if (res.exp && res.exp < Math.ceil(Date.now() / 1000)) return context

    return {
      ...context,
      headers: {
        ...context.headers,
        authorization: 'Bearer ' + jwtToken,
      },
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Account: {
          keyFields: ['address'],
        },
      },
    }),
    ssrMode,
  })
}

export function getAndEnrichClient(
  uri: string,
  ssr: boolean,
  cookies: NextApiRequestCookies | undefined,
  initialState: NormalizedCacheObject,
): ApolloClient<NormalizedCacheObject> {
  const client = _client ?? getClient(uri, ssr, cookies)

  if (initialState) {
    client.restore(initialState)
  }

  if (!ssr && !_client) _client = client

  return client
}

export function concatToQuery<T = any>(
  key: Exclude<keyof T, '__typename'>,
): (
  previousQueryResult: any,
  options: { fetchMoreResult?: any; variables?: OperationVariables },
) => any {
  return (previousQueryResult, { fetchMoreResult }) => {
    if (!fetchMoreResult) return previousQueryResult
    return {
      ...fetchMoreResult,
      [key]: {
        ...fetchMoreResult[key],
        nodes: [
          ...(previousQueryResult[key].nodes || []),
          ...(fetchMoreResult[key].nodes || []),
        ],
      },
    }
  }
}
