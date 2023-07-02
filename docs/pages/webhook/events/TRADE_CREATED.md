---
title: 'TRADE_CREATED'
---

# TRADE_CREATED

This event occurs whenever a trade is executed

## Definition

```ts
type Uint256 = string
type IsoDate = string
type ChainId = number
type Address = string

type TRADE_CREATED = {
  transactionHash: Uint256
  timestamp: IsoDate
  blockNumber: number
  chainId: ChainId
  offer: {
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
  buyer: {
    address: Address
    username: string | null
    email: string | null
  }
  seller: {
    address: Address
    username: string | null
    email: string | null
  }
  amount: Uint256
  unitPrice: Uint256
  quantity: Uint256
  currency: {
    symbol: string
    decimals: number
  }
}
```

## Usage

```ts
import { Events, parseAndVerifyRequest } from '@nft/webhook'

const { data, type } = await parseAndVerifyRequest<'TRADE_CREATED'>(
  req,
  process.env.LITEFLOW_WEBHOOK_SECRET,
)
// data is type Events['TRADE_CREATED']
```
