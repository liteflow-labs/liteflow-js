import { useState } from 'react'

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
      <input
        className="nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
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
