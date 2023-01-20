import { LiteflowProvider, useAuthenticate } from '@nft/hooks'
import { AppProps } from 'next/app'
import { PropsWithChildren } from 'react'
import { useAccount, useDisconnect, WagmiConfig } from 'wagmi'
import { client } from '../connector'
import styles from '../styles/app.module.css'

function AccountProvider(props: PropsWithChildren<{}>) {
  const [authenticate, { resetAuthenticationToken }] = useAuthenticate()
  const { disconnect } = useDisconnect()
  useAccount({
    async onConnect({ connector }) {
      const login = async () => {
        try {
          const signer = await connector.getSigner()
          await authenticate(signer)
        } catch (e) {
          disconnect()
        }
      }
      connector.on('change', login)
      connector.on('disconnect', () => connector.off('change', login))
      await login()
    },
    onDisconnect() {
      resetAuthenticationToken()
    },
  })

  return <>{props.children}</>
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <LiteflowProvider endpoint={process.env.NEXT_PUBLIC_ENDPOINT}>
        <AccountProvider>
          <div className={styles.app}>
            <Component {...pageProps} />
          </div>
        </AccountProvider>
      </LiteflowProvider>
    </WagmiConfig>
  )
}

export default MyApp
