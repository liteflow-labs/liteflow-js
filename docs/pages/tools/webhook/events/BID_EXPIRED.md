---
title: 'BID_EXPIRED'
---

# BID_EXPIRED

This event occurs whenever an open bid is expired

## Definition

```ts
type Uint256 = string
type IsoDate = string
type ChainId = number
type Address = string

type BID_EXPIRED = {
  createdAt: IsoDate
  id: string
  type: 'BUY' | 'SALE'
  asset: {
    id: string
    name: string
    collection: {
      chainId: ChainId
      address: Address
      name: string
    }
  }
  unitPrice: Uint256
  currency: {
    symbol: string
    decimals: number
  }
  maker: {
    address: Address
    username: string | null
    email: string | null
  }
  taker: {
    address: Address
    username: string | null
    email: string | null
  } | null
  quantity: Uint256
  expiredAt: IsoDate
}
```

## Usage

```ts
import { Events, parseAndVerifyRequest } from '@nft/webhook'

const { data, type } = await parseAndVerifyRequest<'BID_EXPIRED'>(
  req,
  process.env.LITEFLOW_WEBHOOK_SECRET,
)
// data is type Events['BID_EXPIRED']
```
