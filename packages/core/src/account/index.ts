import type { AccountVerificationStatus, Sdk } from '../graphql'
import type { Address, Signer } from '../types'
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

  /**
   * Update an account
   * @param {AccountInput} account - The account data to update
   * @param {Signer} signer - The signer to use to update the account
   * @returns {Promise<Address>} The address of the updated account
   */
  async update(account: AccountInput, signer: Signer): Promise<Address> {
    return update(this.sdk, this.uploader, account, signer)
  }

  /**
   * Verify an account
   * @param {Signer} signer - The signer to use to verify the account
   * @returns {Promise<AccountVerificationStatus>} The verification status of the account
   */
  async verify(signer: Signer): Promise<AccountVerificationStatus> {
    return verify(this.sdk, signer)
  }
}
