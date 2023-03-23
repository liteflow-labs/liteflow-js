import type { TypedDataDomain, TypedDataField } from 'ethers'
import type { PatchedRequestInit } from 'graphql-request/dist/types'

export type ClientOption = {
  endpoint: URL
  options?: PatchedRequestInit
}

export type EIP712Data = {
  domain: TypedDataDomain
  types: Record<string, Array<TypedDataField>>
  message: Record<string, any>
}

export type TransactionHash = `0x${string}`
export type ChainId = number
export type Address = `0x${string}`
export type UUID = string

export interface IState<Type = string, Payload = any> {
  type: Type
  payload: Payload
}
