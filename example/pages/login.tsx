import { useIsLoggedIn } from '@nft/hooks'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

export default function Login(): JSX.Element {
  const { push } = useRouter()
  const {
    connect,
    connectors: [connector],
  } = useConnect()
  const { address } = useAccount()
  const isLoggedIn = useIsLoggedIn(address)

  useEffect(() => {
    if (!isLoggedIn) return
    void push('/')
  }, [isLoggedIn, push])

  if (isLoggedIn) return null
  return <button onClick={() => connect({ connector })}>Connect</button>
}
