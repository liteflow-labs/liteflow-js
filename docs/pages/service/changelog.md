---
title: 'Changelog'
---

# Changelog

## v1.0.0-beta.11

> Published the 2023-02-07

#### Breaking Changes

- Change type of `value` in the result of `CALCULATE_ORDER_FEES` from `number` to `Uint96` to allow bigger number

#### Added

- Add type for `CALCULATE_ORDER_FEES` service
- Add `parseAndVerifyRequest` function to verify incoming request from Liteflow
