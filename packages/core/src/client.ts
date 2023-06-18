import { GraphQLClient } from 'graphql-request'
import { Account } from './account'
import { Asset } from './asset'
import { Exchange } from './exchange'
import type { Sdk } from './graphql'
import { getSdk } from './graphql'
import { Uploader } from './uploader'

type Options = {
  readonly endpoint?: URL
  readonly authorization?: string
}

export class Client {
  private readonly sdk: Sdk
  private readonly uploader: Uploader
  public readonly exchange: Exchange
  public readonly asset: Asset
  public readonly account: Account

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
