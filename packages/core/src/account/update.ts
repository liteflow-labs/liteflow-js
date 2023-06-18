import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type { Address, IState, TransactionHash } from '../types'
import type { Uploader } from '../uploader'

export type State =
  | IState<'UPLOAD', {}>
  | IState<'TRANSACTION_SIGNATURE', {}>
  | IState<'TRANSACTION_PENDING', { txHash: TransactionHash }>
  | IState<'OWNERSHIP', {}>

export type AccountInput = {
  name?: string
  description?: string
  email?: string
  twitter?: string
  instagram?: string
  website?: string
  username?: string
  discord?: string
  image?: File | string
  cover?: File | string
}

const formatSocial = (handle: string | undefined): string | undefined =>
  handle ? handle.replace(/^@/, '') : undefined

export async function update(
  sdk: Sdk,
  uploader: Uploader,
  account: AccountInput,
  signer: Signer,
  onProgress?: (state: State) => void,
): Promise<Address> {
  const address = await signer.getAddress()

  onProgress?.({ type: 'UPLOAD', payload: {} })
  const [image, cover] = await Promise.all([
    uploader.publicUpload(account.image),
    uploader.publicUpload(account.cover),
  ])

  const { updateAccount } = await sdk.UpdateAccount({
    input: {
      clientMutationId: null,
      address: address.toLowerCase(),
      patch: {
        image,
        cover,
        name: account.name || null,
        description: account.description || null,
        email: account.email || null,
        twitter: formatSocial(account.twitter) || null,
        instagram: formatSocial(account.instagram) || null,
        website: account.website || null,
        username: account.username || null,
        discord: account.discord || null,
      },
    },
  })

  invariant(updateAccount?.account?.address, 'Account address is missing')

  return updateAccount.account.address
}
