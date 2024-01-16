import type { Signer } from 'ethers'
import { BigNumber } from 'ethers'
import invariant from 'ts-invariant'
import { pollOwnership } from '../exchange/offerQuantityChanges'
import type { Sdk } from '../graphql'
import type { Address, ChainId, EIP712Data, IState } from '../types'
import type { Uploader } from '../uploader'
import { toAddress } from '../utils/convert'
import { signEIP712 } from '../utils/signature'
import type { Asset } from './type'

export type State =
  | IState<'UPLOAD', {}>
  | IState<'LAZYMINT_SIGNATURE', {}>
  | IState<'LAZYMINT_PENDING', {}>
  | IState<'OWNERSHIP', {}>

export async function lazymint(
  sdk: Sdk,
  uploader: Uploader,
  asset: Asset,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<{
  chain: ChainId
  collection: Address
  token: string
}> {
  const account = await signer.getAddress()

  onProgress?.({ type: 'UPLOAD', payload: {} })
  const [image, animationUrl] = await Promise.all([
    uploader.upload(asset.metadata.image),
    uploader.upload(asset.metadata.animationUrl),
  ])

  invariant(image, 'Image is required')

  const payload = {
    chainId: asset.chain,
    collectionAddress: asset.collection,
    asset: {
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
        attributes: asset.metadata.attributes || [],
      },
    },
  }
  const { createLazyMintedAssetSignature } =
    await sdk.CreateLazyMintedAssetSignature(payload)

  invariant(createLazyMintedAssetSignature?.eip712Data)
  onProgress?.({ type: 'LAZYMINT_SIGNATURE', payload: {} })
  const eip712 = createLazyMintedAssetSignature.eip712Data as EIP712Data
  const signature = await signEIP712(signer, eip712)

  onProgress?.({ type: 'LAZYMINT_PENDING', payload: {} })
  const { createLazyMintedAsset } = await sdk.CreateLazyMintedAsset({
    ...payload,
    signature,
    asset: {
      ...payload.asset,
      tokenId: eip712.message.tokenId,
    },
  })

  invariant(createLazyMintedAsset?.asset, 'Asset creation failed')
  onProgress?.({ type: 'OWNERSHIP', payload: {} })
  await pollOwnership(
    sdk,
    createLazyMintedAsset.asset.chainId,
    createLazyMintedAsset.asset.collectionAddress,
    createLazyMintedAsset.asset.tokenId,
    toAddress(account),
    BigNumber.from(0),
  )

  return {
    chain: createLazyMintedAsset.asset.chainId,
    collection: createLazyMintedAsset.asset.collectionAddress,
    token: createLazyMintedAsset.asset.tokenId,
  }
}
