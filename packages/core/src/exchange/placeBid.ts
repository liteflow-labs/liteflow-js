import { BigNumber } from '@ethersproject/bignumber'
import type { OfferInputBis, Sdk } from '../graphql'
import type {
  Address,
  ChainId,
  EIP712Data,
  IState,
  PriceERC20,
  Signer,
  TransactionHash,
  UUID,
  Uint256,
} from '../types'
import { toAddress, toCurrencyId, toTransactionHash } from '../utils/convert'
import { signEIP712 } from '../utils/signature'
import { approveCurrency } from './approveCurrency'

export type State =
  | IState<'APPROVAL_SIGNATURE', {}>
  | IState<'APPROVAL_PENDING', { txHash: TransactionHash }>
  | IState<'OFFER_SIGNATURE', { signature: EIP712Data }>

export type Bid = {
  /**
   * The chain of the asset to place a bid on
   * @type ChainId
   */
  chain: ChainId

  /**
   * The collection of the asset to place a bid on
   * @type Address
   */
  collection: Address

  /**
   * The token of the asset to place a bid on
   * @type string
   */
  token: string

  /**
   * The unit price of the asset to place a bid on (in ERC20)
   * @type PriceERC20
   */
  unitPrice: PriceERC20

  /**
   * The quantity of the asset to place a bid on
   * @type Uint256
   * @default 1
   */
  quantity?: Uint256

  /**
   * The address of the taker
   * @type Address
   * @deprecated This parameter is not used anymore
   */
  taker?: Address

  /**
   * The expiration date of the bid
   * @type Date
   */
  expiredAt?: Date

  /**
   * The metadata associated to the bid
   * @type Record<string, unknown>
   */
  metadata?: Record<string, unknown>
}

export async function placeBid(
  sdk: Sdk,
  { chain, collection, token, unitPrice, quantity, expiredAt, metadata }: Bid,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = signer.account.address

  const offer: OfferInputBis = {
    type: 'BUY',
    makerAddress: toAddress(address),
    chainId: chain,
    collectionAddress: collection,
    tokenId: token,
    currencyId: toCurrencyId(chain, unitPrice.currency),
    unitPrice: BigNumber.from(unitPrice.amount).toString(),
    quantity: BigNumber.from(quantity || '1').toString(),
    expiredAt: expiredAt ? expiredAt.toISOString() : null,
    metadata: metadata,
  }

  onProgress?.({ type: 'APPROVAL_SIGNATURE', payload: {} })
  const tx = await approveCurrency(
    sdk,
    {
      chain,
      currency: unitPrice.currency,
      amount: BigNumber.from(unitPrice.amount)
        .mul(BigNumber.from(quantity || '1'))
        .toString(),
    },
    signer,
  )
  if (tx) {
    onProgress?.({
      type: 'APPROVAL_PENDING',
      payload: { txHash: toTransactionHash(tx.hash) },
    })
    await signer.waitForTransactionReceipt(tx)
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
