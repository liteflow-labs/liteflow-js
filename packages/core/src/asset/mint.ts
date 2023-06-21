import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import invariant from 'ts-invariant'
import { pollOwnership } from '../exchange/offerQuantityChanges'
import type { Sdk } from '../graphql'
import type { Address, ChainId, IState, TransactionHash } from '../types'
import type { Uploader } from '../uploader'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'
import type { MintedAsset } from './type'

export type State =
  | IState<'UPLOAD', {}>
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

export async function mint(
  sdk: Sdk,
  uploader: Uploader,
  asset: MintedAsset,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<{
  chain: ChainId
  collection: Address
  token: string
}> {
  const account = await signer.getAddress()

  onProgress?.({ type: 'UPLOAD', payload: {} })
  const [image, animationUrl, unlockableContent] = await Promise.all([
    uploader.publicUpload(asset.metadata.image),
    uploader.publicUpload(asset.metadata.animationUrl),
    uploader.privateUpload(asset.metadata.unlockableContent),
  ])

  invariant(image, 'Image is required')

  const { createAssetTransaction } = await sdk.CreateAssetTransaction({
    chainId: asset.chain,
    collectionAddress: asset.collection,
    creatorAddress: toAddress(account),
    supply: (asset.supply
      ? BigNumber.from(asset.supply)
      : BigNumber.from(1)
    ).toString(),
    royalties: Math.round((asset.royalties || 0) * 100),
    metadata: {
      description: asset.metadata.description || '',
      name: asset.metadata.name,
      image,
      animationUrl,
      unlockableContent,
      attributes: asset.metadata.attributes || [],
    },
  })

  onProgress?.({ type: 'TRANSACTION_SIGNATURE', payload: {} })
  const tx = await sendTransaction(signer, createAssetTransaction.transaction)

  onProgress?.({
    type: 'TRANSACTION_PENDING',
    payload: { txHash: toTransactionHash(tx.hash) },
  })
  await tx.wait()

  onProgress?.({ type: 'OWNERSHIP', payload: {} })
  await pollOwnership(
    sdk,
    createAssetTransaction.chainId,
    createAssetTransaction.collectionAddress,
    createAssetTransaction.tokenId,
    toAddress(account),
    BigNumber.from(0),
  )

  return {
    chain: createAssetTransaction.chainId,
    collection: createAssetTransaction.collectionAddress,
    token: createAssetTransaction.tokenId,
  }
}
