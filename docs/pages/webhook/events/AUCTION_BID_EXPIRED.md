---
title: 'AUCTION_BID_EXPIRED'
---

# AUCTION_BID_EXPIRED

This event occurs whenever a bid on an auction is expired

## Definition

```ts
type Uint256 = string
type IsoDate = string
type ChainId = number
type Address = string

type AUCTION_BID_EXPIRED = {
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
    address: string
    username: string | null
    email: string | null
  }
  taker: {
    address: string
    username: string | null
    email: string | null
  } | null
  quantity: Uint256
  expiredAt: IsoDate
  auction: {
    id: string
    createdAt: IsoDate
    creator: {
      address: string
      username: string | null
      email: string | null
    }
    endAt: IsoDate
    asset: {
      id: string
      name: string
      collection: {
        chainId: ChainId
        address: Address
        name: string
      }
    }
    reserveAmount: Uint256
    currency: {
      symbol: string
      decimals: number
    }
  } | null
}
```

## Usage

```ts
import { Events, parseAndVerifyRequest } from '@nft/webhook'

const { data, type } = await parseAndVerifyRequest<'AUCTION_BID_EXPIRED'>(
  req,
  process.env.LITEFLOW_WEBHOOK_SECRET,
)
// data is type Events['AUCTION_BID_EXPIRED']
```
