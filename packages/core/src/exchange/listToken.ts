import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import type { OfferInputBis, Sdk } from '../graphql'
import type {
  Address,
  ChainId,
  EIP712Data,
  IState,
  TransactionHash,
  UUID,
} from '../types'
import {
  toAddress,
  toAssetId,
  toCurrencyId,
  toTransactionHash,
} from '../utils/convert'
import { signEIP712 } from '../utils/signature'
import { approveCollection } from './approveCollection'

export type State =
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>
  | IState<'OFFER_SIGNATURE', { signature: EIP712Data }>

export type Listing = {
  chain: ChainId
  collection: Address
  token: string
  unitPrice: {
    amount: BigNumber
    currency: Address | null
  }
  quantity?: BigNumber
  takerAddress?: Address
  expiredAt?: Date
}

export async function listToken(
  sdk: Sdk,
  {
    chain,
    collection,
    token,
    unitPrice,
    quantity,
    takerAddress,
    expiredAt,
  }: Listing,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = await signer.getAddress()

  const offer: OfferInputBis = {
    type: 'SALE',
    makerAddress: toAddress(address),
    assetId: toAssetId(chain, collection, token),
    currencyId: toCurrencyId(chain, unitPrice.currency),
    unitPrice: BigNumber.from(unitPrice.amount).toString(),
    quantity: BigNumber.from(quantity || '1').toString(),
    takerAddress: takerAddress,
    expiredAt: expiredAt ? expiredAt.toISOString() : undefined,
  }

  onProgress?.({ type: 'APPROVAL_SIGNATURE', payload: {} })
  const tx = await approveCollection(sdk, { chain, collection }, signer)
  if (tx) {
    onProgress?.({
      type: 'APPROVAL_PENDING',
      payload: { txHash: toTransactionHash(tx.hash) },
    })
    await tx.wait()
  }

  const {
    createOfferSignature: { eip712Data, salt, timestamp },
  } = await sdk.CreateOfferSignature({ offer })
  onProgress?.({ type: 'OFFER_SIGNATURE', payload: { signature: eip712Data } })

  const signature = await signEIP712(signer, eip712Data)

  const {
    createOffer: {
      offer: { id },
    },
  } = await sdk.CreateOffer({
    offer,
    signature,
    salt,
    timestamp,
  })
  return id
}
