# Changelog

## Unreleased

#### Breaking Changes

- `TokenFormCreate` does not require the `activateLazyMint` props anymore [](https://github.com/liteflow-labs/libraries/pull/)

#### Added

#### Changed

#### Deprecated

#### Removed

#### Fixed

#### Security

## [v1.0.0-beta.6](https://github.com/liteflow-labs/libraries/releases/tag/v1.0.0-beta.6) - 2022-10-28

#### Added

- Added a `dropdownMaxHeight` property to the `Select` component to enable control of the dropdown height. [#58](https://github.com/liteflow-labs/libraries/pull/58)

#### Changed

- Added a property to enable hiding of the "create" button in the case of a platform not having the ability to mint. [#2225](https://github.com/liteflow-labs/nft/pull/2225)

#### Removed

- Removed `autoprefixer` from the package. https://github.com/liteflow-labs/nft/pull/2222

## [v1.0.0-beta.5](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.5) - 2022-10-24

#### Changed

- Update components to Chakra UI:
  - Token [#2173](https://github.com/liteflow-labs/nft/pull/2173)
  - Sales [#2172](https://github.com/liteflow-labs/nft/pull/2172)
  - Trait [#2174](https://github.com/liteflow-labs/nft/pull/2174)
  - User [#2175](https://github.com/liteflow-labs/nft/pull/2175)
  - Wallet [#2179](https://github.com/liteflow-labs/nft/pull/2179)
  - Slider [#2181](https://github.com/liteflow-labs/nft/pull/2181)
  - Select [#2190](https://github.com/liteflow-labs/nft/pull/2190)

#### Removed

- Remove `NetworkSelection` component [#2176](https://github.com/liteflow-labs/nft/pull/2176)
- Remove `Newsletter` component [#2177](https://github.com/liteflow-labs/nft/pull/2177)
- Remove TailwindCSS, PostCSS, HeadlessUI, and clsx dependencies [#2209](https://github.com/liteflow-labs/nft/pull/2209)

#### Fixed

- Fixed an issue with the Activity Menu click area not being fully clickable [#2182](https://github.com/liteflow-labs/nft/pull/2182)

## [v1.0.0-beta.4](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.4) - 2022-10-17

#### Breaking Changes

- Add to components `Token/Form/Create` required param `activateLazyMint` to activate lazy mint of asset [#2140](https://github.com/liteflow-labs/nft/pull/2140)

#### Added

- Enable traits translation [#2073](https://github.com/liteflow-labs/nft/pull/2073)
- Add new component `LazyMintListItem` to display lazy minted asset in Asset history [#2140](https://github.com/liteflow-labs/nft/pull/2140)
- Add the brand50 color to `baseTheme.ts` [#2156](https://github.com/liteflow-labs/nft/pull/2156)

#### Changed

- Put category as traits to when creating an NFT [#2073](https://github.com/liteflow-labs/nft/pull/2073)
- Add missing navigation menu on mobile and fixed design inconsistencies [#2091](https://github.com/liteflow-labs/nft/pull/2091)
- Init `LiteflowProvider` in `LiteflowNFTApp` [#2120](https://github.com/liteflow-labs/nft/pull/2120)
- Update `Session` component to set authentication token to `LiteflowContext` [#2120](https://github.com/liteflow-labs/nft/pull/2120)
- Update `Modal/CreateCollectible` component to be compatible with lazy mint [#2140](https://github.com/liteflow-labs/nft/pull/2140)
- Update components to Chakra UI:
  - Bid [#2102](https://github.com/liteflow-labs/nft/pull/2102)
  - Empty [#2112](https://github.com/liteflow-labs/nft/pull/2112)
  - History list [#2113](https://github.com/liteflow-labs/nft/pull/2113)
  - List [#2114](https://github.com/liteflow-labs/nft/pull/2114)
  - Modal [#2154](https://github.com/liteflow-labs/nft/pull/2154)
  - Navbar [#2162](https://github.com/liteflow-labs/nft/pull/2162)
  - Notifications [#2163](https://github.com/liteflow-labs/nft/pull/2163)
  - Offer [#2164](https://github.com/liteflow-labs/nft/pull/2164)
  - Pagination [#2165](https://github.com/liteflow-labs/nft/pull/2165)
  - Radio [#2167](https://github.com/liteflow-labs/nft/pull/2167)
  - Referral [#2171](https://github.com/liteflow-labs/nft/pull/2171)

#### Fixed

- Truncate buttons text if they overflow their container [#2078](https://github.com/liteflow-labs/nft/pull/2078)
- Fix clickable area of wallet buttons [#2136](https://github.com/liteflow-labs/nft/pull/2136)

## [v1.0.0-beta.3](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.3) - 2022-10-06

#### Breaking Changes

- Require to pass `quantityAvailable` property to `Sales/Direct/Form`, `owned` to `Token/Header` [#2075](https://github.com/liteflow-labs/nft/pull/2075)

#### Changed

- Update Dropzone component to use Chakra UI [#2111](https://github.com/liteflow-labs/nft/pull/2111)

#### Removed

- Remove auto-correction of value in number inputs [#2024](https://github.com/liteflow-labs/nft/pull/2024)

#### Fixed

- Fix notification image not displayed on mobile [#2094](https://github.com/liteflow-labs/nft/pull/2094)

## [v1.0.0-beta.2](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.2) - 2022-09-30

#### Added

- Add `COOKIE_JWT_TOKEN` [#2077](https://github.com/liteflow-labs/nft/pull/2077)
- Add function `authenticateWallet` in `Session` [#2077](https://github.com/liteflow-labs/nft/pull/2077)
  - **Apps that use `LiteflowNFTApp` must not call directly `useAuthenticate` but use `useActivateWallet`**

#### Fixed

- Improve responsive of buttons in Token component [#2040](https://github.com/liteflow-labs/nft/pull/2040)
- Improved responsive of grids, on par with explore page [#2041](https://github.com/liteflow-labs/nft/pull/2041)
- Fixed responsive in direct sale summary component [#2044](https://github.com/liteflow-labs/nft/pull/2044)
- Made the menu items in Navbar fully clickable and replaced old Link with Chakra Link [#2057](https://github.com/liteflow-labs/nft/pull/2057)
- Fix a rendering issue for the Alert component [#2058](https://github.com/liteflow-labs/nft/pull/2058)
- Fix slider image cropping issue [#2079](https://github.com/liteflow-labs/nft/pull/2079)
- Fix cursor pointer issue on Navbar [#2090](https://github.com/liteflow-labs/nft/pull/2090)
- Fix issue when creating new referral when user connect directly on the referral page [#2093](https://github.com/liteflow-labs/nft/pull/2093)
- Fix scrollbar display on mobile on user profile pages tab [#2096](https://github.com/liteflow-labs/nft/pull/2096)

## [v1.0.0-beta.1](https://github.com/liteflow-labs/nft/releases/tag/v1.0.0-beta.1) - 2022-09-13

#### Breaking Changes

- Update components' arguments to accept signer to pass it to hooks [#2027](https://github.com/liteflow-labs/nft/pull/2027)
