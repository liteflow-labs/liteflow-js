import { useState } from 'react'
import { Input } from './Input'

export function DeployButton() {
  const [repo, setRepo] = useState(
    'https://github.com/liteflow-labs/starter-kit',
  )
  const env = [
    'NEXT_PUBLIC_LITEFLOW_API_KEY',
    'NEXT_PUBLIC_BASE_URL',
    'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
  ]
  const url = `https://vercel.com/new/clone?repository-url=${encodeURIComponent(
    repo,
  )}&env=${env.join(',')}`

  return (
    <div className="nx-flex nx-gap-4 nx-mt-4">
      <Input
        type="url"
        placeholder="Your Github Fork"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
      />
      <a href={url} target="_blank" rel="nofollow noopener noreferrer">
        <img src="https://vercel.com/button" />
      </a>
    </div>
  )
}
