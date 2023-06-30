import { LiteflowProvider, useAuthenticate } from '@liteflow/react'
import { AppProps } from 'next/app'
import { PropsWithChildren } from 'react'
import {
  WagmiConfig,
  configureChains,
  createClient,
  goerli,
  mainnet,
  useAccount,
  useDisconnect,
} from 'wagmi'
import { bsc, bscTestnet, polygon, polygonMumbai } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'
import styles from '../styles/app.module.css'

export const { chains, provider } = configureChains(
  [mainnet, goerli, bscTestnet, bsc, polygon, polygonMumbai],
  [publicProvider()],
)

export const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
  provider,
})

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
      <LiteflowProvider apiKey={process.env.NEXT_LITEFLOW_API_KEY}>
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
