import { configureChains, createClient, goerli, mainnet } from 'wagmi'
import { bsc, bscTestnet, polygon, polygonMumbai } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'

export const { chains, provider } = configureChains(
  [mainnet, goerli, bscTestnet, bsc, polygon, polygonMumbai],
  [publicProvider()],
)

export const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
  provider,
})
