# useAcceptOffer

Hook to accept an offer, accessing the active process step as well as the transaction hash.

Can only be executed by an owner of the related NFT if it's a bid, or by anyone if it's a sale.

## Usage

```tsx
import { BigNumber } from '@ethersproject/bignumber'
import { AcceptOfferStep, useAcceptOffer } from '@nft/hooks'
import React from 'react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [acceptOffer, { activeStep, transactionHash }] = useAcceptOffer(signer)

  const handleClick = async () => {
    await acceptOffer(
      {
        id: '66710e28-38d4-11ed-a261-0242ac120002', // ID of the offer
        unitPrice: BigNumber.from(10), // The unit price of this offer. Used to check ERC20 allowance.
      },
      BigNumber.from(1), // The quantity of NFT to accept. Must be 1 for erc721, must be inferior (partial fill) or equal to offer's quantity for erc1155.
    )
  }

  return (
    <>
      {activeStep === AcceptOfferStep.INITIAL && (
        <button onClick={handleClick}>Accept Offer</button>
      )}
      {activeStep === AcceptOfferStep.APPROVAL_SIGNATURE && (
        <p>Please sign the message in wallet</p>
      )}
      {activeStep === AcceptOfferStep.APPROVAL_PENDING && (
        <p>Message signature is pending</p>
      )}
      {activeStep === AcceptOfferStep.TRANSACTION_SIGNATURE && (
        <p>Please sign transaction in wallet</p>
      )}
      {activeStep === AcceptOfferStep.TRANSACTION_PENDING && (
        <p>Transaction is pending</p>
      )}
      {activeStep === AcceptOfferStep.OWNERSHIP && <p>Verifying ownership</p>}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useAcceptOffer(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
[
  (
    offer: {
      id: string
      unitPrice: BigNumberish
    },
    quantity: BigNumberish,
  ) => Promise<void>,           // acceptOffer. function to accept an Offer
  {
    activeStep: AcceptOfferStep,          // returns different values depending on the current acceptation step
    transactionHash: string | undefined   // returns the transaction hash after transaction has been placed on the blockchain
  }
]
```

### acceptOffer

Function to accept an offer for an NFT.

Arguments:

```tsx
(
  offer: {
    id: string, // Id of the offer
    unitPrice: BigNumberish // Price per NFT unit, the price is in the token unit (e.g: Ethereum's WEI) therefore needs to be a BigNumber
  },
  quantity: BigNumberish, // Quantity of asset to accept. Use BigNumber
)
```

### activeStep

The status of the transaction as an enum `AcceptOfferStep` executed in this order. Once the offer acceptation has been complete the state returns to `AcceptOfferStep.INITIAL`

```tsx
enum AcceptOfferStep {
  INITIAL, // Default
  APPROVAL_SIGNATURE, // Message signature has been iniated
  APPROVAL_PENDING, // Message signature is pending
  TRANSACTION_SIGNATURE, // Transaction has been initiated
  TRANSACTION_PENDING, // Transaction is pending
  OWNERSHIP, // Ownership is being verified
}
```

### transactionHash

The hash of the blockchain transaction of the accepted offer. This is only accessible after the approval of the transaction (after `AcceptOfferStep.TRANSACTION_PENDING`)
