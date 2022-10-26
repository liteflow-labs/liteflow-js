import { Signer } from '@ethersproject/abstract-signer'
import {
  ISessionContext,
  SessionContext,
  useAuthenticate,
  useEagerConnect,
  useSigner,
} from '@nft/hooks'
import { useWeb3React } from '@web3-react/core'
import decode, { JwtPayload } from 'jwt-decode'
import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { useCookies } from 'react-cookie'

export const COOKIE_ADDRESS = 'address'
export const COOKIE_JWT_TOKEN = (address: string): string =>
  `jwtToken-${address.toLowerCase()}`

const cookieOptions = {
  secure: true,
  sameSite: true,
  path: '/',
}

const currentJWT = (cookies: {
  [key: string]: string
}): null | { address: string; jwt: string } => {
  const account = cookies[COOKIE_ADDRESS]
  if (!account) return null
  const jwtToken = cookies[COOKIE_JWT_TOKEN(account)]
  if (!jwtToken) return null
  const res = decode<JwtPayload & { address: string }>(jwtToken) // TODO: use `sub` instead of `address`?
  if (res.exp && res.exp < Math.ceil(Date.now() / 1000)) return null
  return { address: res.address.toLowerCase(), jwt: jwtToken }
}

export const currentAccount = (cookies: {
  [key: string]: string
}): string | null => {
  const res = currentJWT(cookies)
  if (!res) return null
  return res.address
}

export type Props = {
  connectors: ISessionContext['connectors']
}

const Session: FC<Props> = ({ connectors, ...props }) => {
  const ssr = typeof window === 'undefined'
  const { account, deactivate, error } = useWeb3React()
  const signer = useSigner()
  const [cookies, setCookie, removeCookie] = useCookies()
  const ready = useEagerConnect(connectors, currentAccount(cookies))
  const [
    _authenticateWallet,
    { setAuthenticationToken, resetAuthenticationToken },
  ] = useAuthenticate()

  const authenticateWallet = useCallback(
    async (
      signer: Signer, // require the signer as argument to make sure this function get called once the signer is defined
    ) => {
      // authenticate
      const { accountAddress, jwtToken } = await _authenticateWallet(signer)

      // decode jwt token to extract expire date
      // minus 1sec to the expiration to be sure
      const jwt = decode<JwtPayload>(jwtToken)
      const expires = jwt.exp ? new Date((jwt.exp - 1) * 1000) : undefined
      const maxAge = jwt.exp
        ? jwt.exp - 1 - Math.ceil(Date.now() / 1000)
        : undefined

      setCookie(COOKIE_JWT_TOKEN(accountAddress), jwtToken, {
        ...cookieOptions,
        expires,
        maxAge,
      })
    },
    [_authenticateWallet, setCookie],
  )

  const logout = useCallback(() => {
    // Remove the JWT associated to the current address from the cookie
    removeCookie(COOKIE_JWT_TOKEN(cookies[COOKIE_ADDRESS]), cookieOptions)
    removeCookie(COOKIE_ADDRESS, cookieOptions)
    // Deactivate the wallet
    deactivate()
  }, [deactivate, removeCookie, cookies])

  useEffect(() => {
    if (ssr) return // Disable cookie writing on the server-side
    if (!ready) return
    // Update the current account in the cookie when the account changes so the client can keep track of the current account
    if (account) {
      setCookie(COOKIE_ADDRESS, account.toLowerCase(), cookieOptions)
    } else {
      removeCookie(COOKIE_ADDRESS, cookieOptions)
    }
  }, [ssr, ready, account, setCookie, removeCookie])

  const loggedInUser = useMemo(() => {
    const current = currentAccount(cookies)
    if (ssr) return current // Trust only cookies for the server
    if (!ready) return null
    if (!account) return null
    if (!current) return null
    if (current.toLowerCase() !== account.toLowerCase()) return null
    return current.toLowerCase()
  }, [ready, ssr, cookies, account])

  useEffect(() => {
    const res = currentJWT(cookies)
    if (!res) return
    setAuthenticationToken(res.jwt)
    return () => {
      resetAuthenticationToken()
    }
  }, [cookies, setAuthenticationToken, resetAuthenticationToken])

  return (
    <SessionContext.Provider
      value={{
        ready: ssr ? true : ready,
        account: loggedInUser,
        error,
        signer,
        connectors,
        deactivate: logout,
        authenticateWallet,
      }}
      {...props}
    />
  )
}

export default Session
