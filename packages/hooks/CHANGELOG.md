# Changelog

## Unreleased

#### Breaking Changes

#### Added

- Add `useConfig` hook to return the configuration of the platform [#65](https://github.com/liteflow-labs/libraries/pull/65)
  - `hasLazyMint` is true when lazymint is activated
  - `hasReferralSystem` is true when the referral and invitation system is activated
  - `hasSocialFeatures` is true when all the social features (likes, comments...) are activated
  - `hasTopUp` is true when fiat on ramp is activated
  - `hasUnlockableContent` is true when unlockable content is activated

#### Changed

- Use of ts-invariant to assert conditions in the codebase + remove useless checks [#](https://github.com/liteflow-labs/libraries/pull/)

#### Deprecated

#### Removed

#### Fixed

- Add proper errors when calling a hook relying on a feature not activated [#65](https://github.com/liteflow-labs/libraries/pull/65)

#### Security

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
