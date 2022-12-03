import { createContext, useContext } from 'react'

export type ISessionContext = {
  account?: string | null
  error?: Error
  deactivate: () => void
}

export const SessionContext = createContext<ISessionContext>({
  deactivate: () => {
    throw new Error('not implemented')
  },
})

export default function useSession(): ISessionContext {
  return useContext(SessionContext)
}
