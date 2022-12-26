import styles from '../styles/app.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { AppProps } from 'next/app'
import {
  chain,
  configureChains,
  useAccount,
  createClient,
  WagmiConfig,
  useDisconnect,
} from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { PropsWithChildren } from 'react'
import { LiteflowProvider, useAuthenticate } from '@nft/hooks'

const { chains, provider } = configureChains(
  [chain[process.env.NEXT_PUBLIC_CHAIN_NAME]], // Pass the name of the Wagmi supported chain. See "chain" types or (https://wagmi.sh/docs/providers/configuring-chains#chains)
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME, // Pass the name of your app
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

function AccountProvider(props: PropsWithChildren) {
  const [authenticate, { setAuthenticationToken, resetAuthenticationToken }] =
    useAuthenticate()
  const { disconnect } = useDisconnect()
  useAccount({
    async onConnect({ address, connector }) {
      // check if user is already authenticated, not only if its wallet is connected
      if (
        localStorage.getItem('authorization.address') === address &&
        localStorage.getItem(`authorization.${address}`)
      ) {
        // since the user is already authenticated we can autoconnect
        setAuthenticationToken(localStorage.getItem(`authorization.${address}`))
        // TODO: should check the expiration date of the jwt token to make sure it's still valid
        return
      }

      // authenticate user
      const signer = await connector.getSigner()
      authenticate(signer)
        .then(({ jwtToken }) => {
          localStorage.setItem('authorization.address', address)
          localStorage.setItem(`authorization.${address}`, jwtToken)
          console.log('user authenticated')
        })
        .catch((error) => {
          console.error(error)

          // disconnect wallet on error
          disconnect()
        })
    },
    onDisconnect() {
      // remove authorization and authentication data
      const address = localStorage.getItem('authorization.address')
      localStorage.removeItem(`authorization.${address}`)
      localStorage.removeItem('authorization.address')
      resetAuthenticationToken()
    },
  })

  return <>{props.children}</>
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode>
        <LiteflowProvider endpoint={process.env.NEXT_PUBLIC_ENDPOINT}>
          <AccountProvider>
            <div className={styles.app}>
              <ConnectButton />
              <Component {...pageProps} />
            </div>
          </AccountProvider>
        </LiteflowProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
