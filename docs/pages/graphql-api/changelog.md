---
title: 'Changelog'
---

# Changelog

## v1.0.0-beta.37

> 2023-08-18

#### Changed

- Speed up resolver collections' number of owners
- Speed up resolver collections' total volume

## v1.0.0-beta.36

> 2023-08-10

#### Fixed

- Fix issue with accounts in queries `topBuyers` and `topSellers`

## v1.0.0-beta.35

> 2023-07-24

#### Changed

- Allow free mint and simple mint function in drops

## v1.0.0-beta.33

> 2023-07-10

#### Added

- Expose Organization's metadata in `config` query
- Expose Collection's metadata
- Expose Offer's metadata
- Add optional metadata to `createOffer` mutation, `orderFees` query
- Expose Transfers
- Add connection between Ownership and Collection

#### Fixed

- Fix mutation `createTransferAssetTransaction`

## v1.0.0-beta.31

> 2023-06-21

#### Added

- Add `abi` field to `Drop`

## v1.0.0-beta.28

> 2023-06-16

#### Added

- Expose filter on Drop metadata field

## v1.0.0-beta.26

> 2023-06-13

#### Added

- Add `metadata` to `Drop`
- Add `isAllowed(minter: Address!): Boolean!` resolver to `Drop` to tell if a minter is in the allow list
- Add `maxQuantity(minter: Address!): Uint256` resolver to `Drop` to return the max quantity a minter can mint

## Changed

- Only expose `allowList` to admins in `Drop`

## v1.0.0-beta.20

> Published the 2023-05-31

#### Added

- Add `allowList`, `mintedByWallet`, and `mintedByWalletAbi` to Drop

#### Changed

- Require one input `integer` to set the quantity in `mintAbi` of Drop
- Rename Drop's `maxQuantityPerMint` to `maxQuantityPerWallet`

## v1.0.0-beta.18

> Published the 2023-05-26

#### Added

- Add new fields to `Drop`: `maxQuantityPerMint`, `supply`, `mintAbi`, and `mintedAbi`
- Add `createDropMinTransaction` mutation
- Add resolver `minted` on `Drop` to return the current number of minted token related to this drop

#### Removed

- Remove non nullability on `query.account`

## v1.0.0-beta.17

> Published the 2023-05-17

#### Added

- Add field `status` to `Offer` with filter and order by features
- Add `salesAndAuctions` filter on `assets` to allow faster filtering on sales and auctions
- Add `deleteAccount` mutation. User can delete their own account
- Add field `status` to `Auction` with filter and order by features
- Add field `protocol` to `Trade`

#### Changed

- Always return `Account` even if it doesn't exist in the backend

#### Deprecated

- Deprecate filter `isImported` on `Account`

## v1.0.0-beta.16

> Published the 2023-05-04

#### Breaking Changes

- Mutation `createComment` now requires `chainId`, `collectionAddress` and `tokenId` instead of `assetId`
- Mutations `createLike` and `deleteLike` now require `chainId`, `collectionAddress` and `tokenId` instead of `assetId`
- Query `like` now require `chainId`, `collectionAddress` and `tokenId` instead of `assetId`

#### Added

- Add field `quantity` to type `Asset` with filter and order by functionalities
- Add field `totalCurrencyDistinctCount` on type `OfferOpenSalesConnection` that returns number of unique currencies from this connection ignoring before/after/first/last/offset
- Add field `collection.quantity` to return the total editions of all NFTs of a collection, with filter and sort functionalities
- Add resolver `ownership(ownerAddress: String)` on type `Asset` to ease the fetch of a specific ownership
- Add resolver `groupedByDate` on types `TradesConnection`, `CollectionsConnection`, `OffersConnection`, `AssetsConnection`, and `AccountsConnection`
- Add field `totalAvailableQuantitySum` on type `OfferOpenSalesConnection` that returns the sum of all the offers' available quantity from from the connection ignoring before/after/first/last/offset
- Add mutation `createCancelOfferTransaction`
- Add fields `chainId`, `collectionAddress`, `tokenId` in many types, queries, and mutations:
  - Type `CreateAssetTransactionPayload`
  - Query `orderFees`
  - Mutation `refreshAsset`
  - Type `AssetWatch`
  - Type `Ownership`
  - Type `Offer`, `OfferOpenBuy`, `OfferOpenSale` and mutation `createOffer`
  - Type `Comment`
  - Type `AssetHistory`
  - Query `ownership`
  - Type `Royalty`
  - Type `Auction` and mutation `createAuction`
  - Mutations `watch` and `unwatch`
  - Mutation `createTransferAssetTransaction`
  - Type `Like`

#### Changed

- Changed value returned by `collection.supply`: it's now return the total number of NFTs of a collection. Also add filter and sort functionalities, and improve its performance by caching the values
- Improve speed of fields `totalListed` and `floorPrice` on type `Collection`
- Improve speed of order by `SALES_MIN_UNIT_PRICE_IN_REF` on query `assets`

#### Deprecated

- Deprecate resolver `cancel` on type `Offer` in favor of new mutation `createCancelOfferTransaction`
- Deprecate `assetId` in favor of `chainId`, `collectionAddress`, `tokenId` in type `CreateAssetTransactionPayload`
- Deprecate `assetId` in favor of `chainId`, `collectionAddress`, `tokenId` in query `orderFees`
- Deprecate field `assetId` in mutation `refreshAsset` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `AssetWatch` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `Ownership` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `Offer`, `OfferOpenBuy`, `OfferOpenSale` and mutation `createOffer` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `AssetTrait` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `Comment` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `AssetHistory` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` in query `ownership` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` on type `Royalty` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `id` in query `asset` in favor of `chainId`, `collectionAddress`, `tokenId`
- Deprecate field `id` in mutation `deleteAsset` in favor of `chainId`, `collectionAddress`, `tokenId`
- Deprecate field `assetId` on type `Auction` and mutation `createAuction` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` in mutations `watch` and `unwatch` in favor of `chainId`, `collectionAddress` and `tokenId`
- Deprecate field `assetId` in favor of `chainId`, `collectionAddress`, `tokenId` in mutation `createTransferAssetTransaction`
- Deprecate field `assetId` on type `Like` in favor of `chainId`, `collectionAddress` and `tokenId`

#### Removed

- Remove mutation `registerLoginAccount`
- Remove queries `currentAccount`, `currentAccountAddress` and `isAdmin`
- Remove spaces at the beginning of lines in the authentication message

## v1.0.0-beta.15

> Published the 2023-04-03

#### Breaking Changes

- Removed `isFollowed` and `isWatched` resolvers and filters from Account, Asset and Collection

#### Added

- New admin APIs:
  - Add new `setRole` mutation only available to admins. This mutation let you change the role of any user and upgrade/downgrade them as admin.
  - Add a new query `admins` returning the list of all the current admin of the platform
- Add autogenerated `slug` to `Asset` to identify any asset with an url-friendly identifier. This identifier is composed of the asset's name and a few random characters.

#### Changed

- Type of `Ownership.quantity` changed from `Uint256` to `Int256`
- Increase performance on resolvers on `Auction.winningOffer`, `collection.numberOfOwners`, `collection.totalListed`, `collection.supply`, and `asset.royalties`.

#### Fixed

- Fix results of filter `content: { match: XXX }` when the search contains multiple words, singular/plural and some other cases

## v1.0.0-beta.14

> Published the 2023-03-09

#### Breaking Changes

- Fix missing plural on connection between `Account` and its `followers`

#### Added

- Add new filter `content: { match: XXX }` to Asset, Collection and Account and the `contentRank` associated and available for ordering (higher is better)

## v1.0.0-beta.13

> Published the 2023-03-01

#### Added

- Expose filter `isImported` on `Account`
- Expose `CollectionTraitValue` and `CollectionTrait` to access collection's trait much faster

#### Deprecated

- Deprecate `Collection.traits`

#### Fixed

- Fix signature issue with Ledger by normalizing signature using `joinSignature` function from ethers.js

## v1.0.0-beta.12

> Published the 2023-02-28

#### Breaking Changes

- Require fields `chainId`, `collectionAddress` and `metadata` and remove deprecated fields from `createLazyMintedAsset` and `createLazyMintedAssetSignature`: `standard`, `name`, `description`, `animationUrl`, `image`, `traits`, `unlockableContent`. Deprecated since v1.0.0-beta.8.
- Remove deprecated mutation `createAsset`. Deprecated since v1.0.0-beta.8.
- Remove deprecated `mint` resolvers. Deprecated since v1.0.0-beta.8.

#### Added

- Expose platform secrets in query `config`, require to be authenticated as an admin
- Add APIs to manage webhooks and services, required to be authenticated as an admin
- Add `importCollection` and `deleteCollection` mutations, required to be authenticated as an admin
- Add user's role in the jwt
- Add resolver `sync` on collection to expose info related to the synchronization of collection. Limited to admin.

#### Removed

- Remove envs `ERC721_ADDRESS` and `ERC1155_ADDRESS`

#### Fixed

- Fix fetch of royalties by using the Rarible Royalties Registry instead of the Collection's smart contract
- Fix fetch of service's endpoint url in query `orderFees`

## v1.0.0-beta.11

> Published the 2023-02-07

#### Breaking Changes

- Config and request's body of `WEBHOOK_CALCULATE_ORDER_FEES` changed. The request's body now directly contains the args instead of previously in payload
  - When connecting as a callback, the payload contained the `type` and `payload`
  - With service, the request contains directly the args
  - Warning: All functions for `CALCULATE_ORDER_FEES` need to be updated to work properly

#### Added

- Adds mutation `createOfferSignature`
- Add `value` and `precision` fields in response of `orderFees` query. The `value` is now a `String` to allow bigger number
- Add new query `rate` and expose `rates` on `currency`

#### Changed

- Mutation `createOffer` now accept `signature`, `timestamp`, and `salt` to create an already signed offer
- Update `getFees` mutation to accept additional optional parameters: `currencyId`, `quantity`, and `unitPrice`
- `orderFees` query now accepts optional `assetId
- Use service table to query service and not webhook

#### Deprecated

- Deprecates mutation `publishOffer` and resolver `offer.eip712Data` in favour of `createOfferSignature` and `createOffer` with signature
- Deprecate `valuePerTenThousand` field in response of `orderFees` query in favour of `value` and `precision` fields

#### Fixed

- Fix mutation `updateAccount` by only updating values present in the query
- Disable `followCollection` and `unfollowCollection` mutation when social plugin is disabled
- Fix `collection.supply` by filtering out assets without owner

## v1.0.0-beta.10

> Published the 2023-01-10

#### Breaking Changes

- Un-exposes the `Asset.unlockableContent` field
- Correctly type the inputs of type `URI`. They previously used the type `String`
- Remove `standard` from `Asset`
- Un-exposes the `Offer.signature` field but keep its filter.
- Un-exposes queries `assetTrait` and `assetTraits`

#### Added

- Add mutation `createCollectionTransaction` to deploy new collection on blockchain
- Add field `mintType` to collection
- Add check of collection's `mintType` in mutations `createAssetTransaction`, `createLazyMintedAsset` and `createLazyMintedAssetSignature`
- Add field `updatedAt` to collection
- Add mutation `updateCollection`
- Add field `tags` to `Collection`
- Add mutations `createCurrencyApprovalTransaction` and `createCollectionApprovalTransaction`
- Add `createOfferFillTransaction` mutation
- Add Collection Following feature

#### Changed

- Prevents the refresh asset function from syncing non-minted assets
- Applies consistent ERC1155 and ERC721 supply validation when creating lazy minted assets

#### Deprecated

- Deprecate `Asset.token`, `Currency.approval`, `ERC721.approval` and `ERC1155.approval` resolvers in favor of `createCurrencyApprovalTransaction` and `createCollectionApprovalTransaction` mutations
- Deprecate `offer.fill` resolver. Use `createOfferFillTransaction` mutation instead

#### Removed

- Remove `ERC20` from `Standard`
