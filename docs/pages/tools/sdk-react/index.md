---
title: 'Introduction'
---

# React SDK

## Installation

Install `@liteflow/react` and its react peer dependency.

```
npm i @liteflow/react
```

## Wrap app with `LiteflowProvider`

Wrap your app with the [`LiteflowProvider`](/docs/LiteflowProvider) component, passing the `apiKey` of your organization.

```tsx
function App() {
  return (
    <LiteflowProvider apiKey="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX">
      <TheRestOfYourApp />
    </LiteflowProvider>
  )
}
```

## Authenticate your user

To authenticate your user you will need to have access to the `Signer` of their wallet with your favorite Web3 library.

```tsx
import { useAuthenticate, useIsLoggedIn } from '@liteflow/react'
import { useMemo } from 'react'
import { publicActions } from 'viem'
import { useWalletClient } from 'wagmi'

function Login() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const signer = useMemo(() => {
    return walletClient?.extend(publicActions)
  }, [walletClient])

  const [authenticate, { resetAuthenticationToken }] = useAuthenticate()
  const loggedIn = useIsLoggedIn(walletClient?.account.address)

  if (!signer) return 'No wallet connected'
  if (loggedIn)
    return <button onClick={resetAuthenticationToken}>Logout</button>
  return <button onClick={() => authenticate(signer)}>Login</button>
}
```

## Use hooks

Every component inside the `LiteflowProvider` is now set up to use the Liteflow hooks.

```tsx
import { BigNumber } from '@ethersproject/bignumber'
import { useCreateOffer } from '@liteflow/react'
import { useMemo } from 'react'
import { publicActions } from 'viem'
import { useWalletClient } from 'wagmi'

function PlaceBid() {
  const { data: walletClient } = useWalletClient()
  const signer = useMemo(() => {
    return walletClient?.extend(publicActions)
  }, [walletClient])

  const [createOffer] = useCreateOffer(signer)

  const handleClick = async () => {
    const offerId = await createOffer({
      type: 'BUY',
      chain: 1, // Ethereum
      collection: `0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d`,
      token: '100',
      quantity: BigNumber.from(1),
      unitPrice: {
        amount: BigNumber.from(1).mul(BigNumber.from(10).pow(18)), // this value is in base unit of the token. This is equivalent to 1 ETH. Use BigNumber
        currency: null, // currency can be set as an address to use ERC20 tokens
      },
    })
    alert(`Offer created: ${offerId}`)
  }

  return <button onClick={handleClick}>Create Offer</button>
}
```

Want to learn more? Check out the [example](https://github.com/liteflow-labs/liteflow-js/tree/main/example) to learn how to setup Liteflow and continue on reading the documentation.
