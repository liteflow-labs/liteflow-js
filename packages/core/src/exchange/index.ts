import type { TransactionResponse } from '@ethersproject/abstract-provider'
import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import type { OfferInputBis, Sdk } from '../graphql'
import type {
  Address,
  ChainId,
  EIP712Data,
  IState,
  TransactionHash,
  Uint256,
  UUID,
} from '../types'
import {
  toAddress,
  toAssetId,
  toCurrencyId,
  toTransactionHash,
} from '../utils/convert'
import { signEIP712 } from '../utils/signature'
import { sendTransaction } from '../utils/transaction'

export type ListingState =
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>
  | IState<'OFFER_SIGNATURE', { signature: EIP712Data }>

export type Listing = {
  chain: ChainId
  collection: Address
  token: string
  unitPrice: {
    amount: Uint256
    currency: Address | null
  }
  quantity?: Uint256
  taker?: Address
  expiredAt?: Date
}

export type PlaceBidState =
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>
  | IState<'OFFER_SIGNATURE', { signature: EIP712Data }>

export type Bid = {
  chain: ChainId
  collection: Address
  token: string
  unitPrice: {
    amount: Uint256
    currency: Address
  }
  quantity?: Uint256
  taker?: Address
  expiredAt?: Date
  auctionId?: UUID
}

export class Exchange {
  private readonly sdk: Sdk

  constructor(sdk: Sdk) {
    this.sdk = sdk
  }

  async placeBid(
    {
      chain,
      collection,
      token,
      unitPrice,
      auctionId,
      expiredAt,
      quantity,
      taker,
    }: Bid,
    signer: Signer,
    onProgress?: (state: PlaceBidState) => void,
  ): Promise<UUID> {
    const address = await signer.getAddress()

    const offer: OfferInputBis = {
      type: 'BUY',
      makerAddress: toAddress(address),
      assetId: toAssetId(chain, collection, token),
      currencyId: toCurrencyId(chain, unitPrice.currency),
      unitPrice: BigNumber.from(unitPrice.amount).toString(),
      quantity: BigNumber.from(quantity || '1').toString(),
      takerAddress: taker,
      expiredAt: expiredAt ? expiredAt.toISOString() : null,
      auctionId: auctionId,
    }

    onProgress?.({ type: 'APPROVAL_SIGNATURE', payload: {} })
    const tx = await this.approveCurrency(
      {
        chain,
        currency: unitPrice.currency,
        amount: BigNumber.from(unitPrice.amount).mul(
          BigNumber.from(quantity || '1'),
        ),
      },
      signer,
    )
    if (tx) {
      onProgress?.({
        type: 'APPROVAL_PENDING',
        payload: { txHash: toTransactionHash(tx.hash) },
      })
      await tx.wait()
    }

    const {
      createOfferSignature: { eip712Data, salt, timestamp },
    } = await this.sdk.CreateOfferSignature({ offer })
    const eip712 = eip712Data as EIP712Data
    onProgress?.({ type: 'OFFER_SIGNATURE', payload: { signature: eip712 } })

    const signature = await signEIP712(signer, eip712)

    const {
      createOffer: {
        offer: { id },
      },
    } = await this.sdk.CreateOffer({
      offer,
      signature,
      salt,
      timestamp,
    })
    return id
  }

  async listToken(
    {
      chain,
      collection,
      token,
      unitPrice,
      expiredAt,
      quantity,
      taker,
    }: Listing,
    signer: Signer,
    onProgress?: (state: ListingState) => void,
  ): Promise<UUID> {
    const address = await signer.getAddress()

    const offer: OfferInputBis = {
      type: 'SALE',
      makerAddress: toAddress(address),
      assetId: toAssetId(chain, collection, token),
      currencyId: toCurrencyId(chain, unitPrice.currency),
      unitPrice: BigNumber.from(unitPrice.amount).toString(),
      quantity: BigNumber.from(quantity || '1').toString(),
      takerAddress: taker,
      expiredAt: expiredAt ? expiredAt.toISOString() : undefined,
    }

    onProgress?.({ type: 'APPROVAL_SIGNATURE', payload: {} })
    const tx = await this.approveCollection({ chain, collection }, signer)
    if (tx) {
      onProgress?.({
        type: 'APPROVAL_PENDING',
        payload: { txHash: toTransactionHash(tx.hash) },
      })
      await tx.wait()
    }

    const {
      createOfferSignature: { eip712Data, salt, timestamp },
    } = await this.sdk.CreateOfferSignature({ offer })
    const eip712 = eip712Data as EIP712Data
    onProgress?.({ type: 'OFFER_SIGNATURE', payload: { signature: eip712 } })

    const signature = await signEIP712(signer, eip712)

    const {
      createOffer: {
        offer: { id },
      },
    } = await this.sdk.CreateOffer({
      offer,
      signature,
      salt,
      timestamp,
    })
    return id
  }

  private async approveCollection(
    {
      chain,
      collection,
    }: {
      chain: ChainId
      collection: Address
    },
    signer: Signer,
  ): Promise<TransactionResponse | null> {
    const address = await signer.getAddress()

    const {
      createCollectionApprovalTransaction: { transaction },
    } = await this.sdk.CreateCollectionApprovalTransaction({
      accountAddress: toAddress(address),
      chainId: chain,
      collectionAddress: toAddress(collection),
    })

    if (!transaction) return null

    return sendTransaction(signer, transaction)
  }

  private async approveCurrency(
    {
      chain,
      currency,
      amount,
    }: {
      chain: ChainId
      currency: Address
      amount: Uint256
    },
    signer: Signer,
  ): Promise<TransactionResponse | null> {
    const address = await signer.getAddress()

    const {
      createCurrencyApprovalTransaction: { transaction },
    } = await this.sdk.CreateCurrencyApprovalTransaction({
      accountAddress: toAddress(address),
      currencyId: toCurrencyId(chain, toAddress(currency)),
      amount: amount.toString(),
    })

    if (!transaction) return null

    return sendTransaction(signer, transaction)
  }
}
