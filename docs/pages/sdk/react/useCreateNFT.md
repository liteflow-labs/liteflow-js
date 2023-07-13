---
title: 'useCreateNFT'
---

# useCreateNFT

Hook for creating an NFT, accessing the active process step as well as the transaction hash

## Usage

```tsx
import { CreateNftStep, useCreateNFT } from '@liteflow/react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [createNFT, { activeStep, transactionHash }] = useCreateNFT(signer, {
    uploadUrl: 'Your liteflow upload URL',
  })

  const handleClick = async () => {
    const isLazyMinted = true
    await createNFT(
      {
        chain: 1, // chainId of the network to mint on
        collection: '0x0000', // address of the collection to use
        supply: 1, // supply of the asset (only needed for ERC1155)
        royalties: 5, // royalty expressed in percentage (eg: 5%)
        metadata: {
          name: 'Azuki #1', // name of the NFT
          description: 'Take the red bean to join the garden.', // description of the NFT
          attributes: [
            { type: 'Head', value: 'Cap' },
            { type: 'Body', value: 'Samurai' },
          ], // Array of traits associated to the NFT
          media: {
            content: azukiImage, // content file uploaded by the user
            preview: azukiImagePreview, // preview in the case of private or animation content uploaded by user
            isAnimation: false, // set to true if content file is a video. Require to set preview
            isPrivate: false, // set to true if content is private. Require to set preview.
          },
        },
      },
      isLazyMinted,
    )
  }

  return (
    <>
      {activeStep === CreateNftStep.INITIAL && (
        <button onClick={handleClick}>Create NFT</button>
      )}
      {activeStep === CreateNftStep.UPLOAD && <p>Images are uploading</p>}
      {activeStep === CreateNftStep.LAZYMINT_SIGNATURE && (
        <p>Please sign transaction for lazy mint in wallet</p>
      )}
      {activeStep === CreateNftStep.LAZYMINT_PENDING && (
        <p>Transaction for lazy mint is pending</p>
      )}
      {activeStep === CreateNftStep.TRANSACTION_SIGNATURE && (
        <p>Please sign transaction in wallet</p>
      )}
      {activeStep === CreateNftStep.TRANSACTION_PENDING && (
        <p>Transaction is pending</p>
      )}
      {activeStep === CreateNftStep.OWNERSHIP && <p>Verifying ownership</p>}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useCreateNFT(
  signer: Signer & TypedDataSigner, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
[
  ({
    chain: ChainId
    collection: Address
    supply?: number
    royalties?: number
    metadata: {
      name: string
      description: string
      attributes?: { traitType: string; value: string }[]
      media: {
        content: File
        preview?: File
        isAnimation: boolean
        isPrivate: boolean
      }
    }
  }, lazymint: boolean) => Promise<string>, // createNFT function
  {
    activeStep: CreateNftStep, // steps of the NFT creation process
    transactionHash: string | undefined // returns the transaction hash after transaction has been placed on the blockchain
  }
]
```

### createNFT

Function to create an NFT. It returns the created NFT ID.

Arguments:

```tsx
{
  chain: ChainId,         // The chain to mint the asset on
  collection: Address,    // The collection to mint the asset on
  supply?: number,        // The supply of the asset. If not set, the asset will be minted as a 1 of 1 even for ERC1155
  royalties?: number,     // The royalties to set on the asset expressed in percentage (eg: 5%)
  metadata: {
    name: string,                                         // The name of the asset
    description: string,                                  // The description of the asset
    attributes?: { traitType: string, value: string }[]   // The attributes of the asset
    media: {
      content: File           // Content for the asset
      preview?: File,         // Preview of the asset (if the content is private or an animation)
      isAnimation: boolean,   // Set the content as animation
      isPrivate: boolean,     // Set the content as private so only owners will be able to read it
    }
  }
}
```

### activeStep

The status of the transaction as an enum `CreateNftStep` executed in this order. Once the NFT creation has been complete the state returns to `CreateNftStep.INITIAL`

```tsx
enum CreateNftStep {
  INITIAL, // Default
  UPLOAD, // Upload has started
  LAZYMINT_SIGNATURE, // Asking signature for lazy mint (only for lazy mint)
  LAZYMINT_PENDING, // Lazy mint is pending (only for lazy mint)
  TRANSACTION_SIGNATURE, // Transaction has been initiated (only for normal mint)
  TRANSACTION_PENDING, // Transaction is pending (only for normal mint)
  OWNERSHIP, // Ownership is being verified (only for normal mint)
}
```

### transactionHash

The hash of the blockchain transaction of the created NFT. This is only accessible after the approval of the transaction (after `CreateNftStep.TRANSACTION_SIGNATURE`)
