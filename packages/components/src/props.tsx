import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { APOLLO_STATE_PROP_NAME, getClient } from './client'
import { COOKIE_ADDRESS, COOKIE_JWT_TOKEN } from './session'

type UserProp = {
  address: string | null
  token: string | null
}

export type PropsWithUser<T> = T & {
  user: UserProp
}

type GetServerSidePropsContextWithUser = GetServerSidePropsContext & {
  user: UserProp
}

export function wrapServerSideProps<T extends { [key: string]: unknown }>(
  url: string,
  handler: (
    context: GetServerSidePropsContextWithUser,
    client: ApolloClient<NormalizedCacheObject>,
  ) => Promise<GetServerSidePropsResult<T>>,
): (
  context: GetServerSidePropsContext,
) => Promise<GetServerSidePropsResult<T>> {
  return async (context) => {
    const client = getClient(url, true, context.req.cookies)
    const contextWithUser = {
      ...context,
      user: {
        address: context.req.cookies[COOKIE_ADDRESS] || null,
        token: context.req.cookies[COOKIE_ADDRESS]
          ? context.req.cookies[
              COOKIE_JWT_TOKEN(context.req.cookies[COOKIE_ADDRESS])
            ] || null
          : null,
      },
    }
    const result = await handler(contextWithUser, client)
    return wrapServerSidePropsResult<T>(contextWithUser, client, result)
  }
}

export function wrapServerSidePropsResult<T extends { [key: string]: unknown }>(
  context: GetServerSidePropsContextWithUser,
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: GetServerSidePropsResult<T>,
): GetServerSidePropsResult<T> {
  if (pageProps && 'props' in pageProps) {
    for (const [key, value] of Object.entries(pageProps.props)) {
      ;(pageProps.props as any)[key] = JSON.parse(JSON.stringify(value))
    }

    ;(pageProps.props as any)[APOLLO_STATE_PROP_NAME] = client.extract()
    ;(pageProps.props as any).user = context.user
  }

  return pageProps
}
