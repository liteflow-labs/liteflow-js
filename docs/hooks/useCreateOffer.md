# useCreateOffer

Hook for creating an offer, accessing the active process step as well as the transaction hash

## Usage

```tsx
import { CreateOfferStep, useCreateOffer } from '@nft/hooks'
import { OfferType } from '@nft/hooks/dist/graphql'
import { BigNumber } from 'ethers'
import React from 'react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [createOffer, { activeStep, transactionHash }] = useCreateOffer(signer)

  const handleClick = async () => {
    await createOffer({
      type: OfferType.Buy,
      quantity: BigNumber.from(1), // Quantity of asset to offer. Must be 1 for offer on ERC721. Use BigNumber
      unitPrice: BigNumber.from(1).mul(BigNumber.from(10).pow(18)), // this value is in base unit of the token. This is equivalent to 1 ETH. Use BigNumber
      assetId:
        '56-0x1e4fc916afcf548a2e62c5865fefe2069755a3a3-26744308925107717638226399784052410886289158766077164738526328260523943400243', // Id of the asset
      currencyId: '56-0x19a4866a85c652eb4a2ed44c42e4cb2863a62d51', // Id of the currency in Liteflow API
      auctionId: '06511214-38d8-11ed-a261-0242ac120002', // Optional, id of the auction to create the offer on.
      expiredAt: '06511214-38d8-11ed-a261-0242ac120002'
        ? null
        : new Date('2025-12-17T03:24:00'), // Optional date at which the offer expired. If not set, the API will enforce one. If offer is on an auction, this date is always set by the API.
      takerAddress: '0xaA6510ac710e97D2A6a280658B5f641dA79891FE', // Optional, wallet address of the offer's receiver. This allows to create an offer that only a specific wallet can accept.
    })
  }

  return (
    <>
      {activeStep === CreateOfferStep.INITIAL && (
        <button onClick={handleClick}>Create Offer</button>
      )}
      {activeStep === CreateOfferStep.APPROVAL_SIGNATURE && (
        <p>Please sign message in wallet</p>
      )}
      {activeStep === CreateOfferStep.APPROVAL_PENDING && (
        <p>Message signature is pending</p>
      )}
      {activeStep === CreateOfferStep.SIGNATURE && (
        <p>Signature is being asked</p>
      )}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useCreateOffer(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
[
  (data: {
    type: OfferType
    quantity: BigNumber
    unitPrice: BigNumber
    assetId: string
    currencyId: string
    takerAddress?: string
    expiredAt: Date | null
    auctionId?: string
  }) => Promise<string>,            // createOffer. function to create an Offer
  {
    activeStep: CreateOfferStep,          // returns different values depending on the current creation step
    transactionHash: string | undefined   // returns the transaction hash after transaction has been placed on the blockchain
  }
]
```

### createOffer

Function to create an offer for an NFT. It returns the created Offer ID.

Arguments `createOfferFn`:

```tsx
{
  type: OfferType,         // "Buy" or "Sell" enum see OfferType
  quantity: BigNumber,     // Quantity of asset to offer. Must be 1 for offer on ERC721. Use BigNumber
  unitPrice: BigNumber,    // Price per NFT unit, the price is in the token unit (e.g: Ethereum's WEI) therefore needs to be a BigNumber
  assetId: string,         // Id of the asset
  currencyId: string,      // Id of the currency in Liteflow API
  takerAddress?: string,   // Optional, wallet address of the offer's receiver. This allows to create an offer that only a specific wallet can accept.
  expiredAt: Date | null,  // Optional date at which the offer expired. If not set, the API will enforce one. If offer is on an auction, this date is always set by the API.
  auctionId?: string      // Optional, Id of the auction to create the offer on.
}
```

### activeStep

The status of the transaction as an enum `CreateOfferStep` executed in this order. Once the offer creation has been complete the state returns to `CreateOfferStep.INITIAL`

```tsx
enum CreateOfferStep {
  INITIAL, // Default
  APPROVAL_SIGNATURE, // Message signature has been initiated
  APPROVAL_PENDING, // Message signature is pending
  SIGNATURE, // Signature is being asked
}
```

### transactionHash

The hash of the blockchain transaction of the created offer. This is only accessible after the approval of the transaction (after `CreateOfferStep.APPROVAL_PENDING`)
