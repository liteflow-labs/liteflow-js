import { GraphQLClient } from 'graphql-request'
import type { PatchedRequestInit } from 'graphql-request/dist/types'
import { Exchange } from './exchange'
import type { Sdk } from './graphql'
import { getSdk } from './graphql'

export class Client {
  private readonly sdk: Sdk
  public readonly exchange: Exchange

  constructor(endpoint: URL, option: PatchedRequestInit = {}) {
    this.sdk = getSdk(new GraphQLClient(endpoint.toString(), option))
    this.exchange = new Exchange(this.sdk)
  }
}
