---
title: 'useCancelOffer'
---

# useCancelOffer

Hook to cancel an offer, accessing the active process step as well as the transaction hash.

## Usage

```tsx
import { CancelOfferStep, useCancelOffer } from '@liteflow/react'
import { useMemo } from 'react'
import { publicActions } from 'viem'
import { useWalletClient } from 'wagmi'

export default function Component() {
  const { data: walletClient } = useWalletClient()
  const signer = useMemo(() => {
    return walletClient?.extend(publicActions)
  }, [walletClient])

  const [cancelOffer, { activeStep, transactionHash }] = useCancelOffer(signer)

  const handleClick = async () => {
    await cancelOffer('6191e7c8-38d5-11ed-a261-0242ac120002')
  }

  return (
    <>
      {activeStep === CancelOfferStep.INITIAL && (
        <button onClick={handleClick}>Cancel Offer</button>
      )}
      {activeStep === CancelOfferStep.TRANSACTION_SIGNATURE && (
        <p>Please sign transaction in wallet</p>
      )}
      {activeStep === CancelOfferStep.TRANSACTION_PENDING && (
        <p>Transaction is pending</p>
      )}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useCancelOffer(
  signer: Signer | undefined // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
;[
  (offerId: string) => Promise<void>, // cancelOffer. function to cancel an Offer
  {
    activeStep: CancelOfferStep, // returns different values depending on the current cancellation step
    transactionHash: string | undefined, // returns the transaction hash after transaction has been placed on the blockchain
  },
]
```

### cancelOffer

Function to cancel an offer for an NFT.

Arguments:

```tsx
(
  offerId: string
)
```

### activeStep

The status of the transaction as an enum `CancelOfferStep` executed in this order. Once the offer cancellation has been complete the state returns to `CancelOfferStep.INITIAL`

```tsx
enum CancelOfferStep {
  INITIAL, // Default
  TRANSACTION_SIGNATURE, // Transaction has been initiated
  TRANSACTION_PENDING, // Transaction is pending
}
```

### transactionHash

The hash of the blockchain transaction of the cancelled offer. This is only accessible after the approval of the transaction (after `CancelOfferStep.TRANSACTION_PENDING`)
