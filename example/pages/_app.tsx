import { LiteflowProvider } from '@liteflow/react'
import { AppProps } from 'next/app'
import {
  WagmiConfig,
  configureChains,
  createConfig,
  mainnet,
  sepolia,
} from 'wagmi'
import { bsc, bscTestnet, polygon, polygonMumbai } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'
import styles from '../styles/app.module.css'

const { publicClient } = configureChains(
  [mainnet, sepolia, bscTestnet, bsc, polygon, polygonMumbai],
  [publicProvider()],
)

const config = createConfig({
  publicClient,
  autoConnect: true,
  connectors: [new InjectedConnector()],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <LiteflowProvider apiKey={process.env.NEXT_PUBLIC_LITEFLOW_API_KEY}>
        <div className={styles.app}>
          <Component {...pageProps} />
        </div>
      </LiteflowProvider>
    </WagmiConfig>
  )
}

export default MyApp
