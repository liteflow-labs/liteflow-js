# NFT Templates

List of templates to use in any application. These templates can be customized with a ChakraUI-based theme.
These templates are meant to be used in a next application and support server side rendering.

## Installation

```
npm i @nft/templates
```

## Documentation

For more information about the different templates available and how to use them, check the storybook https://storybook-templates-liteflow.vercel.app/

## Quick Start

To get started with the templates library you need to ensure that your application adds wraps the `LiteflowNFTApp` components.
Here is an example with a next application.

```tsx
import LiteflowNFTApp from '@nft/components'
import { InjectedConnector } from '@web3-react/injected-connector'
import type { AppProps } from 'next/app'
import { theme } from '../styles/theme'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <LiteflowNFTApp
      ssr={typeof window === 'undefined'}
      endpointUri={'YOUR_LITEFLOW_GRAPHQL_ENDPOINT'}
      cache={pageProps[APOLLO_STATE_PROP_NAME]}
      user={pageProps.user}
      connectors={{
        injected: new InjectedConnector({
          supportedChainIds: [1],
        }),
      }}
      theme={theme}
    >
      <Component {...pageProps} />
    </LiteflowNFTApp>
  )
}
export default MyApp
```

Once this is done you can include any templates in your different pages.
Example:

```tsx
import { Home } from '@nft/templates'
import { NextPage } from 'next'

export const getServerSideProps = Home.server(
  'YOUR_LITEFLOW_GRAPHQL_ENDPOINT',
  ["xxx", "yyy"], // List of nft ids to highlight on the page
  12,
  ["aaa", "bbb", "ccc", ...], // List of NFTs to showcase in the featured section
)

const HomePage: NextPage<Home.Props> = ({
  featuredTokens,
  limit,
  now,
  tokens,
  currentAccount,
}) => {
  return (
    <Home.Template
      currentAccount={currentAccount}
      featuredTokens={featuredTokens}
      limit={limit}
      now={now}
      tokens={tokens}
      explorer={{
        name: "Etherscan",
        url: "https://etherscan.io",
      }}
    />
  )
}

export default HomePage
```
