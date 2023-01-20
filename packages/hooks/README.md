# React Hooks

## Installation

```
npm i @nft/hooks
```

## Quick Start

### 1. Include your favorite wallet provider

Your application is relying on a web3 wallet. Please refer to your preferred web3 provider for the setup.
Here are a few provider tested and supported:

- [WAGMI](https://wagmi.sh/)
- [Web3React](https://github.com/Uniswap/web3-react)
- [RainbowKit](https://www.rainbowkit.com/)

### 2. Wrap app with `LiteflowProvider`

Wrap your app with the [`LiteflowProvider`](/docs/LiteflowProvider) component, passing the `endpoint` of the API to it (similar to `https://api.acme.com/graphql`).

```tsx
function App() {
  return (
    <YourWalletProvider>
      <LiteflowProvider endpoint="https://api.acme.com/graphql">
        <YourRoutes />
      </LiteflowProvider>
    </YourWalletProvider>
  )
}
```

### 3. You're all set!

Every component inside the `LiteflowProvider` is now set up to use the Liteflow hooks.

```tsx
import { useCreateOffer } from '@nft/hooks'
import { OfferType } from '@nft/hooks/dist/graphql'
import { BigNumber } from 'ethers'
import { useSigner } from 'wagmi' // or your favorite web3 wallet

function NFT() {
  const { data: signer } = useSigner()

  const [authenticate] = useAuthenticate()
  const [createOffer] = useCreateOffer(signer)

  useEffect(() => {
    if (!signer) return
    void authenticate(signer)
  }, [signer, authenticate])

  const handleClick = async () => {
    const offerId = await createOffer({
      type: OfferType.Buy,
      quantity: BigNumber.from(1),
      unitPrice: BigNumber.from(1).mul(BigNumber.from(10).pow(18)), // this value is in base unit of the token. This is equivalent to 1 ETH. Use BigNumber
      assetId: 'XXX',
      currencyId: 'XXX',
    })
    alert(`Offer created: ${offerId}`)
  }

  return <button onClick={handleClick}>Create Offer</button>
}
```

Want to learn more? Check out the [example](https://github.com/liteflow-labs/liteflow-js/tree/main/example) to learn how to setup Liteflow and continue on reading the documentation.
