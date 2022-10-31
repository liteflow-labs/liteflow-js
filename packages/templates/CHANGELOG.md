# Changelog

## Unreleased

#### Breaking Changes

#### Added

#### Changed

- Improve bundle size by removing enums in the generated types [#63](https://github.com/liteflow-labs/libraries/pull/63)

#### Deprecated

#### Removed

#### Fixed

- Fix error 500 when accessing the notification template without being logged in [#67](https://github.com/liteflow-labs/libraries/pull/67)

#### Security

## [v1.0.0-beta.6](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.6) - 2022-10-28

#### Fixed

- Fixed storybook to document all templates [#2231](https://github.com/liteflow-labs/nft/pull/2231)

## [v1.0.0-beta.5](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.5) - 2022-10-24

#### Changed

- Update Referral template to use Chakra UI [#2191](https://github.com/liteflow-labs/nft/pull/2191)

#### Removed

- Removed PostCSS dependency [#2213](https://github.com/liteflow-labs/nft/pull/2213)

## [v1.0.0-beta.4](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.4) - 2022-10-17

#### Breaking Changes

- Require to pass `traits` to `AssetForm` and `Explorer` templates [#2073](https://github.com/liteflow-labs/nft/pull/2073)

#### Added

- Add to template `asset/Form` an optional param `activateLazyMint` to activate lazy mint of asset [#2140](https://github.com/liteflow-labs/nft/pull/2140)

#### Removed

- Remove query of categories from API [#2073](https://github.com/liteflow-labs/nft/pull/2073)

#### Fixed

- Truncate buttons text if they overflow their container [#2078](https://github.com/liteflow-labs/nft/pull/2078)

## [v1.0.0-beta.3](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.3) - 2022-10-06

#### Breaking Changes

- Require to pass `currentAccount` property to `AssetForm.Template`, `Home.Template`, `AssetDetail.Template`, and `OfferForm.Template` templates [#2075](https://github.com/liteflow-labs/nft/pull/2075)
- Must implement SSR on page using template `TypeSelector.Template` [#2123](https://github.com/liteflow-labs/nft/pull/2123)

```tsx
export const getServerSideProps = TypeSelector.server(environment.GRAPHQL_URL)
```

#### Added

- Add optional feature to restrict mint to verified account. Require to pass `restrictMintToVerifiedAccount` and `reportEmail` properties to `AssetForm.Template` and `TypeSelector.Template` template to activate it [#2123](https://github.com/liteflow-labs/nft/pull/2123)

#### Changed

- Use sort by reference currency in queries [#2089](https://github.com/liteflow-labs/nft/pull/2089)
- Fetch ownership directly in page queries instead of using `useAssetOwnerQuantity`, `useIsAssetOwner` and `useOwnAllSupply` hooks [#2075](https://github.com/liteflow-labs/nft/pull/2075)

#### Removed

- Remove auto-correction of value in number inputs [#2024](https://github.com/liteflow-labs/nft/pull/2024)

## [v1.0.0-beta.2](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.2) - 2022-09-30

#### Fixed

- Improved responsive of grids, on par with explore page by [#2041](https://github.com/liteflow-labs/nft/pull/2041)

## [v1.0.0-beta.1](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.1) - 2022-09-13

#### Changed

- Pass `Signer` to components' arguments [#2027](https://github.com/liteflow-labs/nft/pull/2027)
