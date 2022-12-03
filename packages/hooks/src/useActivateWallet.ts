import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { useCallback, useEffect, useState } from 'react'
import useSigner from './useSigner'

/**
 * Hook allowing to activate a special connector while knowing which connector is currently being activated
 * Do not use `activate` from `useWeb3React` as this hook also fix edge cases with special connectors
 * @param onAuthenticated -- callback after being authenticated
 * @returns {
 *   activate: (AbstractConnector) => Promise<void> -- Function to call to activate a specific connector
 *   activatingConnector: AbstractConnector -- Connector being activating
 * }
 */

export default function useActivateWallet(onAuthenticated?: () => void): {
  activate: (connector: AbstractConnector) => Promise<void>
  activatingConnector: AbstractConnector | null
} {
  const { activate, error } = useWeb3React()
  const signer = useSigner()

  const [activatingConnector, setActivatingConnector] =
    useState<AbstractConnector | null>(null)

  useEffect(() => {
    setActivatingConnector(null)
    return () => {
      setActivatingConnector(null)
    }
  }, [error])

  useEffect(() => {
    if (!signer) return
    if (!activatingConnector) return
    onAuthenticated && onAuthenticated()
  }, [signer, activatingConnector, onAuthenticated])

  const activateWithConnector = useCallback(
    async (connector: AbstractConnector) => {
      if (connector instanceof WalletConnectConnector) {
        if (activatingConnector === connector) return // Still loading
        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        // from issue https://github.com/NoahZinsmeister/web3-react/issues/124#issuecomment-993923827
        // let's remove this hack when issue is resolved
        connector.walletConnectProvider = undefined
      }
      try {
        setActivatingConnector(connector)
        await activate(connector, undefined, true)
      } finally {
        setActivatingConnector(null)
      }
    },
    [activate, activatingConnector, setActivatingConnector],
  )

  return {
    activate: activateWithConnector,
    activatingConnector,
  }
}
