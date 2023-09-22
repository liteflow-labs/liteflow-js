import { Interface } from '@ethersproject/abi'
import type { BigNumberish, Signer } from 'ethers'
import { BigNumber } from 'ethers'
import invariant from 'ts-invariant'
import { pollOwnership } from '../exchange/offerQuantityChanges'
import type { Sdk } from '../graphql'
import type { Address, ChainId, IState, TransactionHash, UUID } from '../types'
import { toAddress, toTransactionHash } from '../utils/convert'
import { sendTransaction } from '../utils/transaction'

export type State =
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
]
const transferInterface = new Interface(abi)

export async function mintDrop(
  sdk: Sdk,
  dropId: UUID,
  quantity: BigNumberish,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<
  {
    chain: ChainId
    collection: Address
    token: string
  }[]
> {
  const address = await signer.getAddress()

  const { drop } = await sdk.FetchDrop({ dropId })
  invariant(drop, "Can't find drop")

  const {
    createDropMintTransaction: { transaction },
  } = await sdk.CreateDropMintTransaction({
    dropId,
    quantity: BigNumber.from(quantity).toString(),
    minter: toAddress(address),
  })

  onProgress?.({ type: 'TRANSACTION_SIGNATURE', payload: {} })
  const tx = await sendTransaction(signer, transaction)

  onProgress?.({
    type: 'TRANSACTION_PENDING',
    payload: { txHash: toTransactionHash(tx.hash) },
  })
  const receipt = await tx.wait()
  const transfers = [] as { tokenId: string }[]
  for (const log of receipt.logs || []) {
    try {
      const parsed = transferInterface.parseLog(log)
      if (parsed.name !== 'Transfer') continue
      transfers.push({ tokenId: parsed.args.tokenId.toString() })
    } catch (e) {}
  }

  invariant(transfers[0], 'Error checking ownership')

  onProgress?.({ type: 'OWNERSHIP', payload: {} })
  await pollOwnership(
    sdk,
    drop.chainId,
    drop.collectionAddress,
    transfers[0].tokenId,
    toAddress(address),
    BigNumber.from(0),
  )

  const tokenIds = transfers.map((t) => t.tokenId)
  const tokens = tokenIds.map((tokenId) => ({
    chain: drop.chainId,
    collection: drop.collectionAddress,
    token: tokenId,
  }))

  return tokens
}
