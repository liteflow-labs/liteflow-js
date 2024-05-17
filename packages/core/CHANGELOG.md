# @liteflow/core

## 3.0.0

### Major Changes

- [#238](https://github.com/liteflow-labs/liteflow-js/pull/238) [`a2bdad8`](https://github.com/liteflow-labs/liteflow-js/commit/a2bdad8533bac0f5de6bf0c2189b75e23bb23f8a) Thanks [@NicolasMahe](https://github.com/NicolasMahe)! - Replace Ethers.js by Viem

### Patch Changes

- [#226](https://github.com/liteflow-labs/liteflow-js/pull/226) [`6aa847b`](https://github.com/liteflow-labs/liteflow-js/commit/6aa847bc9c21af76fdbc0456bd47e3554331abb3) Thanks [@NicolasMahe](https://github.com/NicolasMahe)! - Replace `assetId` by `chainId`, `collectionAddress` and `tokenId`, and deprecate `takerAddress` in `listToken` and `placeBid`.

- [#224](https://github.com/liteflow-labs/liteflow-js/pull/224) [`3f577d3`](https://github.com/liteflow-labs/liteflow-js/commit/3f577d361b8fd886ecf1afa822959b2ab553a8ac) Thanks [@NicolasMahe](https://github.com/NicolasMahe)! - Use mutation `createCancelOfferTransaction` instead of deprecated query `offer.cancel`

- [#225](https://github.com/liteflow-labs/liteflow-js/pull/225) [`ca11e0b`](https://github.com/liteflow-labs/liteflow-js/commit/ca11e0bfd95e2357a6b0796a5ce6a3077d9d11b7) Thanks [@NicolasMahe](https://github.com/NicolasMahe)! - Use new queries `listing` and `openOffer` instead of now deprecated `offer`

- [#221](https://github.com/liteflow-labs/liteflow-js/pull/221) [`40c1fd6`](https://github.com/liteflow-labs/liteflow-js/commit/40c1fd672f576ed234fd39d8fac007b35efc5126) Thanks [@ismailToyran](https://github.com/ismailToyran)! - Export BatchPurchaseStep

## 2.0.0

### Major Changes

- [#215](https://github.com/liteflow-labs/liteflow-js/pull/215) [`d6c7c60`](https://github.com/liteflow-labs/liteflow-js/commit/d6c7c608d713cf626f944676a882676193da6e9c) Thanks [@antho1404](https://github.com/antho1404)! - Remove auction system.

- [#216](https://github.com/liteflow-labs/liteflow-js/pull/216) [`43247cc`](https://github.com/liteflow-labs/liteflow-js/commit/43247cca709e991cc0474c39bae149b9a1683fae) Thanks [@antho1404](https://github.com/antho1404)! - Remove unlockable content

## 1.3.1

### Patch Changes

- [#212](https://github.com/liteflow-labs/liteflow-js/pull/212) [`2e5cecf`](https://github.com/liteflow-labs/liteflow-js/commit/2e5cecf1acb9d9585a8b4a7ace8137c7d33ed2c0) Thanks [@antho1404](https://github.com/antho1404)! - Add missing graphql-tag dependency

## 1.3.0

### Minor Changes

- [#202](https://github.com/liteflow-labs/liteflow-js/pull/202) [`426e3fd`](https://github.com/liteflow-labs/liteflow-js/commit/426e3fd1a4b1da27a789046cf5ca0b823e8dcb22) Thanks [@antho1404](https://github.com/antho1404)! - Add batch purchase feature to purchase multiple offers in a single transaction

### Patch Changes

- [#199](https://github.com/liteflow-labs/liteflow-js/pull/199) [`69b5307`](https://github.com/liteflow-labs/liteflow-js/commit/69b5307f4a7f1b63ca106ce9059dc8501d65473f) Thanks [@NicolasMahe](https://github.com/NicolasMahe)! - Remove unnecessary fields from `FetchOffer` query

## 1.2.0

### Minor Changes

- [#175](https://github.com/liteflow-labs/liteflow-js/pull/175) [`79424f0`](https://github.com/liteflow-labs/liteflow-js/commit/79424f0238b87ec70b3d597b95387e910425e9ea) Thanks [@ismailToyran](https://github.com/ismailToyran)! - Add new mintDrop function and useMintDrop hook

## 1.1.1

### Patch Changes

- [#173](https://github.com/liteflow-labs/liteflow-js/pull/173) [`7404c72`](https://github.com/liteflow-labs/liteflow-js/commit/7404c7254a523eaa794f4e9c992f9bf08001809b) Thanks [@antho1404](https://github.com/antho1404)! - Fetch ownership and asset when checking changes of ownership/minting

## 1.1.0

### Minor Changes

- [#165](https://github.com/liteflow-labs/liteflow-js/pull/165) [`b13df6d`](https://github.com/liteflow-labs/liteflow-js/commit/b13df6d1487a274c40b9d08bce24a3c1cdc9c4c8) Thanks [@NicolasMahe](https://github.com/NicolasMahe)! - Add metadata to bid, listing and offer
