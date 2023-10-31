---
title: 'AUCTION_EXPIRED'
---

# AUCTION_EXPIRED

Whenever an auction expires

## Definition

```ts
type Uint256 = string
type IsoDate = string
type ChainId = number
type Address = string

type AUCTION_EXPIRED = {
  id: string
  createdAt: IsoDate
  creator: {
    address: Address
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
}
```

## Usage

```ts
import { Events, parseAndVerifyRequest } from '@nft/webhook'

const { data, type } = await parseAndVerifyRequest<'AUCTION_EXPIRED'>(
  req,
  process.env.LITEFLOW_WEBHOOK_SECRET,
)
// data is type Events['AUCTION_EXPIRED']
```