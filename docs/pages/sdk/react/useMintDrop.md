---
title: 'useMintDrop'
---

# useMintDrop

Hook for minting a drop, accessing the active process step as well as the transaction hash

## Usage

```tsx
import { MintDropStep, useMintDrop } from '@liteflow/react'

export default function Component() {
  const signer = undefined // type of "Signer & TypedDataSigner" Get the signer from the wallet. Need to be an Ethers Signer (https://docs.ethers.io/v5/api/signer/)
  const [mintDrop, { activeStep, transactionHash }] = useMintDrop(signer)

  const handleClick = async () => {
    await mintDrop({
      dropId: '1', // the dropId of the drop to mint
      quantity: 5, // the quantity of the drop to mint
    })
  }

  return (
    <>
      {activeStep === MintDropStep.INITIAL && (
        <button onClick={handleClick}>Create NFT</button>
      )}
      {activeStep === MintDropStep.TRANSACTION_SIGNATURE && (
        <p>Please sign transaction in wallet</p>
      )}
      {activeStep === MintDropStep.TRANSACTION_PENDING && (
        <p>Transaction is pending</p>
      )}
      {activeStep === MintDropStep.OWNERSHIP && <p>Verifying ownership</p>}
      {transactionHash && <p>Transaction hash is {transactionHash}</p>}
    </>
  )
}
```

## Configuration

```tsx
useMintDrop(
  signer: Signer & TypedDataSigner, // Ethers signer: https://docs.ethers.io/v5/api/signer/
)
```

## Return values

```tsx
[
  ({
    dropId: UUID // The dropId of the drop to mint
    quantity: BigNumberish // The quantity of the drop to mint
  }) => Promise<{ chain: ChainId; collection: Address; token: string }[]>, // MintDrop function
  {
    activeStep: MintDropStep, // steps of the drop minting process
    transactionHash: string | undefined // returns the transaction hash after transaction has been placed on the blockchain
  }
]
```

### mintDrop

Function to mint a drop that returns a promise that resolves to an array of objects containing the `chain`, `collection`, and `token` of the minted asset.

Arguments:

```tsx
{
  dropId: UUID // The dropId of the drop to mint
  quantity: BigNumberish // The quantity of the drop to mint
}
```

### activeStep

The status of the transaction as an enum `MintDropStep` executed in this order. Once the drop minting has been complete the state returns to `MintDropStep.INITIAL`

```tsx
enum MintDropStep {
  INITIAL, // Default
  TRANSACTION_SIGNATURE, // Transaction has been initiated
  TRANSACTION_PENDING, // Transaction is pending
  OWNERSHIP, // Ownership is being verified
}
```

### transactionHash

The hash of the blockchain transaction of the created NFT. This is only accessible after the approval of the transaction (after `MintDropStep.TRANSACTION_SIGNATURE`)
