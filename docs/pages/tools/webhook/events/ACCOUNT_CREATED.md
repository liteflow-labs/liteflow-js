---
title: 'ACCOUNT_CREATED'
---

# ACCOUNT_CREATED

This event occurs whenever an account is created.

## Definition

```ts
type Address = string

type ACCOUNT_CREATED = {
  address: Address
  username: string | null
  email: string | null
  referrer: {
    address: Address
    username: string | null
    email: string | null
  } | null
}
```

## Usage

```ts
import { Events, parseAndVerifyRequest } from '@nft/webhook'

const { data, type } = await parseAndVerifyRequest<'ACCOUNT_CREATED'>(
  req,
  process.env.LITEFLOW_WEBHOOK_SECRET,
)
// data is type Events['ACCOUNT_CREATED']
```
