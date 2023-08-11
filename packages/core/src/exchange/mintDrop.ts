import type { Signer } from 'ethers'
import type { Sdk } from '../graphql'
import type {
  Address,
  ChainId,
  IState,
  TransactionHash,
  UUID,
  Uint256,
} from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'
import { checkOwnership, pollOwnership } from './offerQuantityChanges'

export type State =
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

export type Drop = {
  /**
   * The chain of the drop to be minted
   * @type ChainId
   */
  chain: ChainId

  /**
   * The collection of the drop to be minted
   * @type Address
   */
  collection: Address

  /**
   * The dropId of the drop to be minted
   * @type UUID
   */
  dropId: UUID
}

export async function mintDrop(
  sdk: Sdk,
  { chain, collection, dropId }: Drop,
  quantity: Uint256,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = await signer.getAddress()

  const {
    createDropMintTransaction: { transaction },
  } = await sdk.CreateDropMintTransaction({
    dropId,
    quantity: quantity.toString(),
    minter: toAddress(address),
  })

  const initialQuantity = await checkOwnership(
    sdk,
    chain,
    collection,
    dropId,
    toAddress(address),
  )

  onProgress?.({ type: 'TRANSACTION_SIGNATURE', payload: {} })
  const tx = await sendTransaction(signer, transaction)

  onProgress?.({
    type: 'TRANSACTION_PENDING',
    payload: { txHash: toTransactionHash(tx.hash) },
  })
  await tx.wait()

  onProgress?.({ type: 'OWNERSHIP', payload: {} })
  await pollOwnership(
    sdk,
    chain,
    collection,
    dropId,
    toAddress(address),
    initialQuantity,
  )

  return dropId
}
