import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import { checkOwnership, pollOwnership } from '../exchange/offerQuantityChanges'
import type { Sdk } from '../graphql'
import type { IState, TransactionHash, UUID, Uint256 } from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'

export type State =
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

export async function mintDrop(
  sdk: Sdk,
  dropId: UUID,
  quantity: Uint256,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<UUID> {
  const address = await signer.getAddress()

  const { drop } = await sdk.FetchDrop({ dropId })
  invariant(drop, "Can't find drop")

  const {
    createDropMintTransaction: { transaction },
  } = await sdk.CreateDropMintTransaction({
    dropId,
    quantity: quantity.toString(),
    minter: toAddress(address),
  })

  const initialQuantity = await checkOwnership(
    sdk,
    drop.chainId,
    drop.collectionAddress,
    drop.id,
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
    drop.chainId,
    drop.collectionAddress,
    drop.id,
    toAddress(address),
    initialQuantity,
  )

  return dropId
}
