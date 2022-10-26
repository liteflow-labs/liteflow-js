import { useSession } from '@nft/hooks'
import { useEffect, useRef } from 'react'

// Hook to execute the `reloadFn` when the `account` from `useSession` changes.
export default function useExecuteOnAccountChange(reloadFn: () => any): void {
  const { account, ready } = useSession()
  const ref = useRef(true)
  useEffect(() => {
    if (!ready) return
    if (ref.current) {
      ref.current = false
      return
    }
    void reloadFn()
  }, [reloadFn, account, ready])
}
