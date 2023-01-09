import { useContext, useEffect, useState } from 'react'
import { LiteflowContext } from './context'
import { Config } from './graphql'

// This type can be reused for any other read-only hook
type Result<T = any> = {
  data?: T
  error?: Error
}

export default function useConfig(): Result<Config> {
  const { sdk } = useContext(LiteflowContext)
  const [config, setConfig] = useState<Config>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    sdk
      .GetConfig()
      .then(({ config }) => config)
      .catch(setError)
    return () => setConfig(undefined)
  }, [setConfig, setError, sdk])

  return {
    data: config,
    error,
  }
}
