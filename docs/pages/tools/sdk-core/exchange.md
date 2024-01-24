---
title: 'Exchange'
---

# Exchange

The `Exchange` module provides a set of methods to interact with the marketplace. It allows you to place bids, list tokens for sale, cancel bids or listings, accept bids, and buy tokens.

## Methods

### placeBid

This method allows you to place a bid on a token.

```ts
async placeBid(
  bid: Bid,
  signer: Signer,
  onProgress?: (state: PlaceBidState) => void,
): Promise<UUID>
```

### listToken

This method allows you to list a token for sale.

```ts
async listToken(
  listing: Listing,
  signer: Signer,
  onProgress?: (state: ListTokenState) => void,
): Promise<UUID>
```

### cancelBid

This method allows you to cancel a bid.

```ts
async cancelBid(
  bidId: UUID,
  signer: Signer,
  onProgress?: (state: CancelOfferState) => void,
): Promise<UUID>
```

### cancelListing

This method allows you to cancel a listing.

```ts
async cancelListing(
  listingId: UUID,
  signer: Signer,
  onProgress?: (state: CancelOfferState) => void,
): Promise<UUID>
```

### acceptBid

This method allows you to accept a bid.

```ts
async acceptBid(
  bidId: UUID,
  quantity: Uint256,
  signer: Signer,
  onProgress?: (state: AcceptOfferState) => void,
): Promise<UUID>
```

### buyToken

This method allows you to accept a listing.

```ts
async buyToken(
  listingId: UUID,
  quantity: Uint256,
  signer: Signer,
  onProgress?: (state: AcceptOfferState) => void,
): Promise<UUID>
```

### batchPurchase

This method allows you to purchase multiple listing.
**Note:** The signer should already have approved the transfer of the tokens otherwise the transaction will fail.

```ts
async batchPurchase(
  purchases: { listingId: UUID; quantity: Uint256 }[],
  signer: Signer,
  onProgress?: (state: BatchPurchaseState) => void,
): Promise<UUID>
```

### getOffer

This low-level API retrieves an offer. The offer can be either a bid or a listing.

```ts
async getOffer(
  offerId: UUID,
): Promise<NonNullable<FetchOfferQuery['offer']>>
```

Each method in the `Exchange` module returns a `Promise` that resolves to a `UUID` representing the ID of the action performed (bid placed, token listed, bid cancelled, etc.). The `getOffer` method returns a `Promise` that resolves to the offer details.

The `signer` parameter is an instance of `Signer` used to sign transactions. The `onProgress` parameter is an optional callback function that can be used to track the progress of the operation.
