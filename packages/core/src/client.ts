import { GraphQLClient } from 'graphql-request'
import { Account } from './account'
import { Asset } from './asset'
import { Exchange } from './exchange'
import type { Sdk } from './graphql'
import { getSdk } from './graphql'
import { Uploader } from './uploader'

type Options = {
  /**
   * The endpoint to use for the client
   * @type {URL}
   * @default https://api.liteflow.com
   */
  readonly endpoint?: URL

  /**
   * The authorization token to use for the client
   * @type {string}
   * @default undefined
   */
  readonly authorization?: string
}

export class Client {
  private readonly sdk: Sdk
  private readonly uploader: Uploader

  /**
   * Exchange module to interact with the exchange and manage listings, bids and auctions
   * @type {Exchange}
   */
  public readonly exchange: Exchange
  /**
   * Asset module to interact with assets and minting
   * @type {Asset}
   */
  public readonly asset: Asset
  /**
   * Account module to interact with accounts and verification
   * @type {Account}
   */
  public readonly account: Account

  /**
   * Create a new Liteflow client
   * @param {string} apiKey - The API key to use for the client (can be found in the Liteflow dashboard)
   * @param {Options} options - The options to use for the client
   */
  constructor(apiKey: string, options: Options = {}) {
    const endpoint = options.endpoint ?? new URL('https://api.liteflow.com')
    const authorization = options.authorization ?? undefined
    const graphqlEndpoint = new URL(`/${apiKey}/graphql`, endpoint)
    const uploadEndpoint = new URL(`/${apiKey}/uploadToIPFS`, endpoint)
    const graphQLClient = new GraphQLClient(graphqlEndpoint.toString(), {
      headers: authorization
        ? { Authorization: `Bearer ${authorization}` }
        : undefined,
    })

    this.uploader = new Uploader(uploadEndpoint)
    this.sdk = getSdk(graphQLClient)
    this.exchange = new Exchange(this.sdk)
    this.asset = new Asset(this.sdk, this.uploader)
    this.account = new Account(this.sdk, this.uploader)
  }
}
