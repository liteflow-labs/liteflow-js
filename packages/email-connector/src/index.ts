// https://github.com/NoahZinsmeister/web3-react/blob/v6.1.9/packages/magic-connector/src/index.ts

import { MagicUserMetadata } from '@magic-sdk/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  FailedVerificationError,
  MagicLinkExpiredError,
  MagicLinkRateLimitError,
  UserRejectedRequestError,
} from '@web3-react/magic-connector'
import { ConnectorUpdate } from '@web3-react/types'
import {
  CustomNodeConfiguration,
  Magic,
  MagicSDKAdditionalConfiguration,
  RPCError,
  RPCErrorCode,
} from 'magic-sdk'
import { invariant } from 'ts-invariant'

type Props = {
  apiKey: string
  options: Omit<MagicSDKAdditionalConfiguration, 'network'> & {
    network: Omit<CustomNodeConfiguration, 'chainId'> & { chainId: number }
  }
}

export class EmailConnector extends AbstractConnector {
  private chainId: number
  private email: string | null = null

  public magic: Magic | null

  constructor({ apiKey, options }: Props) {
    super({ supportedChainIds: [options.network.chainId] })
    this.chainId = options.network.chainId
    this.magic = null
    try {
      this.magic = new Magic(apiKey, options)
    } catch (e) {
      console.warn('cannot initialize magic-sdk')
    }
  }

  public async loggedInUser(): Promise<MagicUserMetadata | null> {
    if (!this.magic) return null
    const isLoggedIn = await this.magic.user.isLoggedIn()
    if (!isLoggedIn) return null
    return this.magic.user.getMetadata()
  }

  public withEmail(email: string): EmailConnector {
    this.email = email
    return this
  }

  public async activate(): Promise<ConnectorUpdate> {
    invariant(this.magic, 'Magic needs to be instantiated')
    invariant(
      this.email,
      'Email is required, please use the `connector.withEmail(email)` method',
    )

    const user = await this.loggedInUser()
    if (user && user.email !== this.email) {
      await this.magic.user.logout()
    }

    try {
      await this.magic.auth.loginWithMagicLink({ email: this.email })
    } catch (err) {
      if (!(err instanceof RPCError)) {
        throw err
      }
      if (err.code === RPCErrorCode.MagicLinkFailedVerification) {
        throw new FailedVerificationError()
      }
      if (err.code === RPCErrorCode.MagicLinkExpired) {
        throw new MagicLinkExpiredError()
      }
      if (err.code === RPCErrorCode.MagicLinkRateLimited) {
        throw new MagicLinkRateLimitError()
      }
      // This error gets thrown when users close the login window.
      // -32603 = JSON-RPC InternalError
      if (err.code === -32603) {
        throw new UserRejectedRequestError()
      }
    } finally {
      this.email = null
    }

    const provider = this.magic.rpcProvider
    const account = await provider.enable().then((accounts) => accounts[0])

    return { provider, chainId: this.chainId, account }
  }

  public async getProvider(): Promise<any> {
    invariant(this.magic, 'Magic needs to be instantiated')
    return this.magic.rpcProvider
  }

  public async getChainId(): Promise<number | string> {
    return this.chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!this.magic) return null
    return this.magic.rpcProvider
      .send('eth_accounts')
      .then((accounts) => accounts[0] || null)
  }

  public deactivate(): void {
    // noop
  }

  public async close(): Promise<void> {
    if (this.magic) await this.magic.user.logout()
    this.emitDeactivate()
  }
}
