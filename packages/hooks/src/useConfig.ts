import { useContext, useEffect, useState } from 'react'
import { LiteflowContext } from './context'
import { Config } from './graphql'

// This type can be reused for any other read-only hook
type Result<T = any> = {
  data?: T
  error?: Error
  loading: boolean
}

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
    return () => setConfig(undefined)
  }, [setConfig, setError, sdk])

  return {
    data: config,
    error,
    loading,
  }
}
