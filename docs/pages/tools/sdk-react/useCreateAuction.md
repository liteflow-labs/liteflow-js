---
title: 'useCreateAuction'
---

# useCreateAuction

Hook for creating an auction

## Usage

```tsx
import { useCreateAuction } from '@liteflow/react'
import { BigNumber } from 'ethers'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [createAuction, { loading }] = useCreateAuction(signer)

  const handleClick = async () => {
    await createAuction({
      chain: 56,
      collection: '0x1e4fc916afcf548a2e62c5865fefe2069755a3a3',
      token:
        '26744308925107717638226399784052410886289158766077164738526328260523943400243',
      endAt: new Date('2025-12-17T03:24:00'), // Auction end date
      reservePrice: {
        amount: BigNumber.from(1).toString(), // Minimum price required to accept auction when it ends.
        currency: '0x19a4866a85c652eb4a2ed44c42e4cb2863a62d51', // Address of the currency to use for the auction
      },
      auctionValiditySeconds: 604800, // extra time added to the auction end date to allow seller to accept the auction. After this date, the bids will be expired and the seller will not be able to accept any bid.
    })
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      Create Auction
    </button>
  )
}
```

## Configuration

```tsx
useCreateAuction(
  signer: Signer | undefined, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
;[
  (input: {
    chain: ChainId
    collection: Address
    token: string
    endAt: Date
    auctionValiditySeconds: number
    reservePrice: {
      amount: BigNumberish
      currency: Address
    }
  }) => Promise<string>, // createAuction. function to create an auction, returns id of the auction
  {
    loading: boolean, // returns true if the auction is being created
  },
]
```

### createAuction

Function to create an auction for an NFT. Returns a promise that resolve with the auction ID created.

Arguments:

```tsx
{
  assetId: string, // Asset of the id to put on auction
  endAt: Date, // Auction end date
  auctionValiditySeconds: number, // extra time added to the auction end date to allow seller to accept the auction. After this date, the bids will be expired and the seller will not be able to accept any bid.
  reserveAmount: string, // Minimum price required to accept auction (BigNumber converted to string)
  currencyId: string, // Id of the currency to use for the auction
}
```

### loading

Returns `true` if the auction is being created
