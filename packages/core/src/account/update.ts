import type { Signer } from 'ethers'
import invariant from 'ts-invariant'
import type { Sdk } from '../graphql'
import type { Address } from '../types'
import type { Uploader } from '../uploader'

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
): Promise<Address> {
  const address = await signer.getAddress()

  const [image, cover] = await Promise.all([
    uploader.upload(account.image),
    uploader.upload(account.cover),
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
