---
title: 'useBatchPurchase'
---

# useBatchPurchase

Hook to accept multiple offers, accessing the active process step as well as the transaction hash.
**Note:** The signer should already have approved the transfer of the tokens otherwise the transaction will fail.

## Usage

```tsx
import { BigNumber } from '@ethersproject/bignumber'
import { BatchPurchaseStep, useBatchPurchase } from '@liteflow/react'
import { useMemo } from 'react'
import { publicActions } from 'viem'
import { useWalletClient } from 'wagmi'

export default function Component() {
  const { data: walletClient } = useWalletClient()
  const signer = useMemo(() => {
    return walletClient?.extend(publicActions)
  }, [walletClient])

  const [batchPurchase, { activeStep, transactionHash }] =
    useBatchPurchase(signer)

  const handleClick = async () => {
    await batchPurchase([
      {
        listingId: '66710e28-38d4-11ed-a261-0242ac120002', // ID of the offer
        quantity: BigNumber.from(1), // The quantity of NFT to accept. Must be 1 for erc721, must be inferior (partial fill) or equal to offer's quantity for erc1155.
      },
      {
        listingId: '66710e28-38d4-11ed-a261-0242ac120003', // ID of the offer
        quantity: BigNumber.from(1), // The quantity of NFT to accept. Must be 1 for erc721, must be inferior (partial fill) or equal to offer's quantity for erc1155.
      },
    ])
  }

  return (
    <>
      {activeStep === BatchPurchaseStep.INITIAL && (
        <button onClick={handleClick}>Batch purchase</button>
      )}
      {activeStep === BatchPurchaseStep.TRANSACTION_SIGNATURE && (
        <p>Please sign transaction in wallet</p>
      )}
      {activeStep === BatchPurchaseStep.TRANSACTION_PENDING && (
        <p>Transaction is pending</p>
      )}
      {activeStep === BatchPurchaseStep.OWNERSHIP && <p>Verifying ownership</p>}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useBatchPurchase(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
;[
  (purchases: { offerId: string; quantity: BigNumberish }[]) => Promise<void>, // batchPurchase function to accept a purchase multiple offers
  {
    activeStep: BatchPurchaseStep, // returns different values depending on the current purchase step
    transactionHash: string | undefined, // returns the transaction hash after transaction has been placed on the blockchain
  },
]
```

### batchPurchase

Function to accept multiple offers.

Arguments:

```tsx
(
  purchases: {
    listingId: string, // Id of the offer
    quantity: BigNumberish, // Quantity of asset to accept. Use BigNumber
  }[]
)
```

### activeStep

The status of the transaction as an enum `BatchPurchaseStep` executed in this order. Once the offer acceptation has been complete the state returns to `BatchPurchaseStep.INITIAL`

```tsx
enum BatchPurchaseStep {
  INITIAL, // Default
  TRANSACTION_SIGNATURE, // Transaction has been initiated
  TRANSACTION_PENDING, // Transaction is pending
  OWNERSHIP, // Ownership is being verified
}
```

### transactionHash

The hash of the blockchain transaction of the accepted offer. This is only accessible after the approval of the transaction (after `BatchPurchaseStep.TRANSACTION_PENDING`)
