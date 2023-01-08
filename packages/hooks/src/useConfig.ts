import { useContext } from 'react'
import { LiteflowContext } from './context'
import { Config } from './graphql'

export default function useConfig(): () => Promise<Config> {
  const { config } = useContext(LiteflowContext)
  return config
}
