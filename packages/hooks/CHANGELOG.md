# Changelog

## Unreleased

#### Breaking Changes

#### Added

#### Changed

- Use new flow of offer creation using the new mutation `createOfferSignature` [#119](https://github.com/liteflow-labs/liteflow-js/pull/119)

#### Deprecated

#### Removed

#### Fixed

- Fix imports order by updating `prettier` and `prettier-plugin-organize-imports` [#114](https://github.com/liteflow-labs/liteflow-js/pull/114)

#### Security

## [v1.0.0-beta.10](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.10) - 2022-12-23

#### Breaking Changes

- The `useCreateNFT` function has been updated to accept `chainId` and `collectionAddress` as arguments, rather than the previous `standard` attribute. To migrate your application to this new version, you will need to pass the desired collection to `useCreateNFT` by either fetching it dynamically or hardcoding it in your code. [#102](https://github.com/liteflow-labs/liteflow-js/pull/102)
- Removed parsePrice from package. [#106](https://github.com/liteflow-labs/liteflow-js/pull/106)

#### Added

- Add new error message for user rejected transaction on wallet [#99](https://github.com/liteflow-labs/liteflow-js/pull/99)

#### Changed

- Change react library from dependency to peerDependencies and accept react 18 [#97](https://github.com/liteflow-labs/liteflow-js/pull/97)
- Updated `@nft/api-graphql` lib to `1.0.0-beta.9` (https://github.com/liteflow-labs/liteflow-js/pull/102)
- Improve types check [#109](https://github.com/liteflow-labs/liteflow-js/pull/109)

## [v1.0.0-beta.9](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.9) - 2022-12-12

#### Breaking Changes

- Remove deprecated `useEagerConnect`, `useActivateWallet`, `useSession`, `useSigner` [#90](https://github.com/liteflow-labs/liteflow-js/pull/90)
  - Have a look to https://github.com/liteflow-labs/starter-kit/pull/44 to follow the migration or https://github.com/liteflow-labs/minimal-app

#### Added

- Add `useConfig` hook to return the configuration of the platform [#65](https://github.com/liteflow-labs/libraries/pull/65)
  - `hasLazyMint` is true when lazymint is activated
  - `hasReferralSystem` is true when the referral and invitation system is activated
  - `hasSocialFeatures` is true when all the social features (likes, comments...) are activated
  - `hasTopUp` is true when fiat on ramp is activated
  - `hasUnlockableContent` is true when unlockable content is activated
- Add `currentAddress` to the general context [#90](https://github.com/liteflow-labs/liteflow-js/pull/90)

#### Fixed

- Add proper errors when calling a hook relying on a feature not activated [#65](https://github.com/liteflow-labs/libraries/pull/65)

## [v1.0.0-beta.8](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.8) - 2022-11-15

#### Changed

- Update @nft/api-graphql to version v1.0.0-beta.7 [#86](https://github.com/liteflow-labs/liteflow-js/pull/86)

#### Fixed

- Force `ownerAddress` to lowercase in `useCheckOwnership` hook [#85](https://github.com/liteflow-labs/liteflow-js/pull/85)

## [v1.0.0-beta.7](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.7) - 2022-11-03

#### Changed

- Use of ts-invariant to assert conditions in the codebase + remove useless checks [#64](https://github.com/liteflow-labs/libraries/pull/64)
- Remove unnecessary `graphql` dependency[#66](https://github.com/liteflow-labs/libraries/pull/66)
- Improve bundle size by removing enums in the generated types [#63](https://github.com/liteflow-labs/libraries/pull/63)

#### Fixed

- Ensure that the `parsePrice` doesn't crash even with invalid input [#68](https://github.com/liteflow-labs/libraries/pull/68)

## [v1.0.0-beta.6](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.6) - 2022-10-28

#### Added

- Add `isValid` to auction status hook to return true if the auction if valid, false otherwise [#59](https://github.com/liteflow-labs/libraries/pull/59)

## [v1.0.0-beta.5](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.5) - 2022-10-24

#### Added

- Added missing dependencies `graphql` and `graphql-tag` [#2198](https://github.com/liteflow-labs/nft/pull/2198)

## [v1.0.0-beta.4](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.4) - 2022-10-17

#### Breaking Changes

- Remove `category` from `useCreateNFT` [#2073](https://github.com/liteflow-labs/nft/pull/2073)
- Add `LiteflowProvider` to configure hooks package [#2120](https://github.com/liteflow-labs/nft/pull/2120)
- Hook `useCreateNFT` now require param `signer` to be typed `Signer & TypedDataSigner` (previously only `Signer`) [#2140](https://github.com/liteflow-labs/nft/pull/2140)

#### Added

- Add `setAuthenticationToken` and `resetAuthenticationToken` to `useAuthenticate` hook [#2120](https://github.com/liteflow-labs/nft/pull/2120)
- Add to hook `useCreateNFT` optional param `isLazyMint` to activate lazy mint of asset [#2140](https://github.com/liteflow-labs/nft/pull/2140)
- Add to `CreateNftStep` returned by hook `useCreateNFT` two new steps `LAZYMINT_SIGNATURE` and `LAZYMINT_PENDING` to reflect the lazy mint flow [#2140](https://github.com/liteflow-labs/nft/pull/2140)

#### Changed

- Replace Apollo client from the hooks by graphql-request [#2120](https://github.com/liteflow-labs/nft/pull/2120)
- Update hook `useCreateNFT` to be compatible with lazy mint of asset [#2140](https://github.com/liteflow-labs/nft/pull/2140)

## [v1.0.0-beta.3](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.3) - 2022-10-06

#### Breaking Changes

- Remove hooks
  - `useAssetOwnerQuantity` [#2075](https://github.com/liteflow-labs/nft/pull/2075)
  - `useIsAssetOwner` [#2075](https://github.com/liteflow-labs/nft/pull/2075)
  - `useOwnAllSupply` [#2075](https://github.com/liteflow-labs/nft/pull/2075)
  - `usePaginate`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useCreateComment` [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useLike` [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useFileTransformer` [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useFormatAddress`: kept helper `formatAddress` [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useErrorFormatter`: kept helper `formatError` [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useParsePrice`: kept helper `parsePrice` [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useBlockExplorer`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useExecuteOnAccountChange`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useLocalFileURL`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useLoginRedirect`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useNow`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useOrderById`: moved to template package but not exported [#2107](https://github.com/liteflow-labs/nft/pull/2107)
  - `useIPFSUploader`: removed from export [#2107](https://github.com/liteflow-labs/nft/pull/2107)

#### Added

- Add optional discord handle to `useUpdateAccount` hook [#2104](https://github.com/liteflow-labs/nft/pull/2104)

#### Changed

- Use sort by reference currency in queries [#2089](https://github.com/liteflow-labs/nft/pull/2089)

## [v1.0.0-beta.2](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.2) - 2022-09-30

#### Breaking Changes

- Remove `COOKIE_JWT_TOKEN` [#2077](https://github.com/liteflow-labs/nft/pull/2077)

#### Added

- Add function `authenticateWallet` in `ISessionContext` [#2077](https://github.com/liteflow-labs/nft/pull/2077)

#### Removed

- Remove dependencies between `useActivateWallet` and `useSession` [#2067](https://github.com/liteflow-labs/nft/pull/2067)
- Remove set JWT in cookie from hook `useAuthenticate`, return it instead [#2077](https://github.com/liteflow-labs/nft/pull/2077)

#### Fixed

- Fix loading state of hook `useAuthenticate` [#2099](https://github.com/liteflow-labs/nft/pull/2099)

## [v1.0.0-beta.1](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.1) - 2022-09-13

#### Breaking Changes

- Update hooks to accept signer [#2027](https://github.com/liteflow-labs/nft/pull/2027)
