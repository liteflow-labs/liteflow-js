# NFT Components

List of components to use in any application. These components can be customized with a ChakraUI-based theme.

## Installation

```
npm i @nft/components
```

## Documentation

For more information about the different components available and how to use them, check the storybook https://storybook-components-liteflow.vercel.app/

## Quick Start

To get started with the components library you need to ensure that your application adds wraps the `LiteflowNFTApp` components.
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

Once this is done you can include any components in your different pages.
Example:

```tsx
import { TokenCard } from '@nft/components'

export default function Home() {
  return (
    <TokenCard
      asset={{
        id: 'xxx',
        image: 'https://xxx',
        name: 'xxx',
        standard: 'ERC721',
        unlockedContent: undefined,
        animationUrl: undefined,
      }}
      creator={{
        address: '0x',
        name: 'xxx',
        image: 'https://xxx',
        verified: undefined,
      }}
      auction={undefined}
      hasMultiCurrency={false}
      numberOfSales={0}
      sale={undefined}
    />
  )
}
```
