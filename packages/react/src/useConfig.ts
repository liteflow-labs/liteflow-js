import { useContext, useEffect, useState } from 'react'
import { LiteflowContext } from './context'
import { GetConfigQuery } from './graphql'

// This type can be reused for any other read-only hook
type Result<T = any> = {
  data?: T
  error?: Error
  loading: boolean
}

type Config = Omit<GetConfigQuery['config'], '__typename'>
export type ConfigResult = Result<Config>

export default function useConfig(): ConfigResult {
  const { sdk } = useContext(LiteflowContext)
  const [config, setConfig] = useState<Config>()
  const [error, setError] = useState<Error>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    sdk
      .GetConfig()
      .then(({ config }) => setConfig(config))
      .catch(setError)
      .finally(() => setLoading(false))
    return () => {
      setError(undefined)
      setLoading(false)
      setConfig(undefined)
    }
  }, [setConfig, setError, sdk])

  return {
    data: config,
    error,
    loading,
  }
}
