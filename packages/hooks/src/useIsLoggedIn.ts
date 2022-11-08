import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { isSameAddress } from './utils/address'

/**
 * Hook to determine if an address is the currently connected account.
 * @param address -- address to test
 * @returns boolean -- true if the address is the current account, false otherwise
 */
export default function useIsLoggedIn(address: string): boolean {
  const { account } = useWeb3React()

  return useMemo(() => {
    if (!account) return false
    if (!address) return false
    return isSameAddress(account, address)
  }, [account, address])
}
