import type { Signer } from 'ethers'
import type { AccountVerificationStatus, Sdk } from '../graphql'
import type { Address } from '../types'
import type { Uploader } from '../uploader'
import type { AccountInput } from './update'
import { update } from './update'
import { verify } from './verify'

export class Account {
  private readonly sdk: Sdk
  private readonly uploader: Uploader

  constructor(sdk: Sdk, uploader: Uploader) {
    this.sdk = sdk
    this.uploader = uploader
  }

  async update(account: AccountInput, signer: Signer): Promise<Address> {
    return update(this.sdk, this.uploader, account, signer)
  }

  async verify(signer: Signer): Promise<AccountVerificationStatus> {
    return verify(this.sdk, signer)
  }
}
