import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import type { OfferInputBis, Sdk } from '../graphql'
import type {
  Address,
  ChainId,
  EIP712Data,
  IState,
  PriceERC20,
  PriceNative,
  TransactionHash,
  UUID,
  Uint256,
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
  /**
   * The chain of the asset to be listed
   * @type ChainId
   */
  chain: ChainId

  /**
   * The collection of the asset to be listed
   * @type Address
   */
  collection: Address

  /**
   * The token of the asset to be listed
   * @type string
   */
  token: string

  /**
   * The unit price of the asset to be listed (in native currency or ERC20)
   * @type PriceNative | PriceERC20
   */
  unitPrice: PriceNative | PriceERC20

  /**
   * The quantity of the asset to be listed
   * @type Uint256
   * @default 1
   */
  quantity?: Uint256

  /**
   * The address of the taker of the asset
   * @type Address
   */
  taker?: Address

  /**
   * The expiration date of the listing
   * @type Date
   */
  expiredAt?: Date

  /**
   * The metadata associated to the bid
   * @type Record<string, unknown>
   */
  metadata?: Record<string, unknown>
}

export async function listToken(
  sdk: Sdk,
  {
    chain,
    collection,
    token,
    unitPrice,
    quantity,
    taker,
    expiredAt,
    metadata,
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
    takerAddress: taker,
    expiredAt: expiredAt ? expiredAt.toISOString() : undefined,
    metadata: metadata,
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
  const eip712 = eip712Data as EIP712Data
  onProgress?.({ type: 'OFFER_SIGNATURE', payload: { signature: eip712 } })

  const signature = await signEIP712(signer, eip712)

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
