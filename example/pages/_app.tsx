import { LiteflowProvider } from '@liteflow/react'
import { AppProps } from 'next/app'
import {
  WagmiConfig,
  configureChains,
  createClient,
  goerli,
  mainnet,
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <LiteflowProvider apiKey={process.env.NEXT_PUBLIC_LITEFLOW_API_KEY}>
        <div className={styles.app}>
          <Component {...pageProps} />
        </div>
      </LiteflowProvider>
    </WagmiConfig>
  )
}

export default MyApp
