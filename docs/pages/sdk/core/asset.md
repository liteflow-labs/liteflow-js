---
title: 'Asset'
---

# Asset

The `Asset` module provides methods to mint assets either directly on-chain or off-chain (lazymint). Lazyminted assets are minted on-chain when they are purchased.

## Methods

### mint

This method allows you to mint an asset directly on-chain.

```ts
async mint(
  asset: Type.Asset,
  signer: Signer,
  onProgress?: (state: MintState) => void,
): Promise<{
  chain: ChainId
  collection: Address
  token: string
}>
```

### lazymint

This method allows you to mint an asset off-chain. The asset will be minted on-chain later when it is purchased.

```ts
async lazymint(
  asset: Type.Asset,
  signer: Signer,
  onProgress?: (state: LazymintState) => void,
): Promise<{
  chain: ChainId
  collection: Address
  token: string
}>
```

Each method in the `Asset` class returns a `Promise` that resolves to an object containing the `chain`, `collection`, and `token` of the minted asset.

The `asset` parameter is the asset data to mint. The `signer` parameter is an instance of `Signer` used to sign transactions. The `onProgress` parameter is an optional callback function that can be used to track the progress of the operation.
