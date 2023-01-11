import { useContext, useMemo } from 'react'
import { LiteflowContext } from './context'
import { isSameAddress } from './utils/address'

/**
 * Hook to determine if an address is the currently connected account.
 * @param address -- address to test
 * @returns boolean -- true if the address is the current account, false otherwise
 */
export default function useIsLoggedIn(address: string | undefined): boolean {
  const { currentAddress } = useContext(LiteflowContext)

  return useMemo(() => {
    if (!currentAddress) return false
    if (!address) return false
    return isSameAddress(currentAddress, address)
  }, [currentAddress, address])
}
