import { SessionContext } from '@nft/hooks'
import { useWeb3React } from '@web3-react/core'
import jwtDecode from 'jwt-decode'
import React, { FC, useMemo } from 'react'
import { useCookies } from 'react-cookie'

export const COOKIE_JWT_TOKEN = `jwt-token`

const Session: FC<{}> = ({ ...props }) => {
  const { account, deactivate, error } = useWeb3React()
  const [cookies] = useCookies([COOKIE_JWT_TOKEN])

  const loggedInUser = useMemo(() => {
    const jwt = cookies[COOKIE_JWT_TOKEN]
    if (!jwt) return null
    const current = jwtDecode<{ address: string }>(jwt).address
    if (typeof window === 'undefined') return current // Trust only cookies for the server
    if (!account) return null
    if (!current) return null
    if (current.toLowerCase() !== account.toLowerCase()) return null
    return current.toLowerCase()
  }, [cookies, account])

  return (
    <SessionContext.Provider
      value={{
        account: loggedInUser,
        error,
        deactivate: deactivate,
      }}
      {...props}
    />
  )
}

export default Session
