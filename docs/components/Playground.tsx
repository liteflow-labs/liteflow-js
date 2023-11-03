import 'graphiql/graphiql.min.css'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Input } from './Input'

const GraphiQL = dynamic(() => import('graphiql'), {
  ssr: false,
})

const defaultQuery = `{
  assets(first: 10) {
    nodes {
      name
      collection {
        chainId
        name
      }
    }
  }
}`

export function Playground() {
  const [apiKey, setApiKey] = useState('')
  const valid = useMemo(
    () =>
      apiKey.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      ),

    [apiKey],
  )
  const graphQLFetcher = useCallback(
    async (graphQLParams) => {
      if (!apiKey) {
        alert('Please enter your Liteflow API Key')
      }
      const response = await fetch(
        `https://api.liteflow.com/${apiKey}/graphql`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphQLParams),
        },
      )
      return response.json()
    },
    [apiKey],
  )

  useEffect(() => {
    setApiKey(localStorage.getItem('liteflow-docs.apiKey') || '')
  }, [])

  useEffect(() => {
    if (!valid) return
    localStorage.setItem('liteflow-docs.apiKey', apiKey)
  }, [apiKey, valid])

  return (
    <div className="nx-gap-4">
      <div>
        <label className="nx-text-sm nx-font-medium nx-mt-4">
          Liteflow API Key
          <Input
            type="text"
            placeholder="Liteflow API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="nx-mt-2 nx-mb-2"
          />
        </label>
        <span>
          You can find your API Key in your Liteflow developer settings{' '}
          <a
            href="https://dashboard.liteflow.com/developer/connection"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </span>
      </div>
      {valid && (
        <GraphiQL fetcher={graphQLFetcher} defaultQuery={defaultQuery} />
      )}
    </div>
  )
}
