---
title: 'useAcceptAuction'
---

# useAcceptAuction

Hook for accepting an auction, accessing the active process step as well as the transaction hash.

This action can only be executed by the creator of the auction.

## Usage

```tsx
import { AcceptAuctionStep, useAcceptAuction } from '@liteflow/react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [acceptAuction, { activeStep, transactionHash }] =
    useAcceptAuction(signer)

  const handleClick = async () => {
    await acceptAuction('c59af08c-38d2-11ed-a261-0242ac120002')
  }

  return (
    <>
      {activeStep === AcceptAuctionStep.INITIAL && (
        <button onClick={handleClick}>Accept Auction</button>
      )}
      {activeStep === AcceptAuctionStep.RESOLVE_BEST_BID && (
        <p>Finding the best bid</p>
      )}
      {activeStep === AcceptAuctionStep.APPROVAL_SIGNATURE && (
        <p>Please sign the message in wallet</p>
      )}
      {activeStep === AcceptAuctionStep.APPROVAL_PENDING && (
        <p>Message signature is pending</p>
      )}
      {activeStep === AcceptAuctionStep.TRANSACTION_SIGNATURE && (
        <p>Please sign transaction in wallet</p>
      )}
      {activeStep === AcceptAuctionStep.TRANSACTION_PENDING && (
        <p>Transaction is pending</p>
      )}
      {activeStep === AcceptAuctionStep.OWNERSHIP && <p>Verifying ownership</p>}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useAcceptAuction(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
;[
  (auctionId: string) => Promise<void>, // acceptAuction. function to accept an Auction
  {
    activeStep: AcceptAuctionStep, // returns different values depending on the current acceptation step
    transactionHash: string | undefined, // returns the transaction hash after transaction has been placed on the blockchain
  },
]
```

### acceptAuction

Function to accept an auction for an NFT.

Arguments:

```tsx
auctionId: string // ID of the auction to accept
```

### activeStep

The status of the action as an enum `AcceptAuctionStep` executed in this order. Once the auction has been accepted, the state returns to `AcceptAuctionStep.INITIAL`

```tsx
enum AcceptAuctionStep {
  INITIAL, // Default
  RESOLVE_BEST_BID, // Looks for and accepts the highest bid
  APPROVAL_SIGNATURE, // The message has been signed
  APPROVAL_PENDING, // The message is being processed on the blockchain
  TRANSACTION_SIGNATURE, // The transaction has been signed
  TRANSACTION_PENDING, // The transaction is being processed on the blockchain
  OWNERSHIP, // The ownership is being verified
}
```

### transactionHash

The hash of the blockchain transaction of the accepted auction. This is only accessible after the approval of the transaction (after `AcceptAuctionStep.TRANSACTION_PENDING`). It is reset after step `AcceptAuctionStep.OWNERSHIP`.
