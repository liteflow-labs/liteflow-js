import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { createContext, useContext } from 'react'

export type ISessionContext = {
  account?: string | null
  error?: Error
  signer?: Signer & TypedDataSigner
  connectors: {
    injected?: InjectedConnector
    email?: EmailConnector
    walletConnect?: WalletConnectConnector
    coinbase?: WalletLinkConnector
  }
  deactivate: () => void
  authenticateWallet: (signer: Signer) => Promise<void>
}

export const SessionContext = createContext<ISessionContext>({
  connectors: {},
  deactivate: () => {
    throw new Error('not implemented')
  },
  authenticateWallet: () => {
    throw new Error('not implemented')
  },
})

export default function useSession(): ISessionContext {
  return useContext(SessionContext)
}
