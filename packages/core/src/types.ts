import type { BigNumberish } from '@ethersproject/bignumber'
import type {
  Account,
  Chain,
  Hex,
  PublicActions,
  Transport,
  WalletClient,
} from 'viem'

/**
 * Signer is an object representing a wallet that can sign transactions and messages
 */
export type Signer<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> = WalletClient<TTransport, TChain, TAccount> &
  PublicActions<TTransport, TChain, TAccount>

/**
 * EIP712Data is an object representing the data needed to sign a message using EIP712
 */
export type EIP712Data = {
  domain: {
    name?: string
    version?: string
    chainId?: number
    verifyingContract?: Address
    salt?: Hex
  }
  types: Record<string, Array<{ name: string; type: string }>>
  message: Record<string, any>
  primaryType: string
}

/**
 * A TransactionHash is a string starting with 0x with a length of 66
 */
export type TransactionHash = `0x${string}`

/**
 * A ChainId is a number (eg: 1 for Ethereum Mainnet)
 */
export type ChainId = number

/**
 * An Address is a string starting with 0x with a length of 42
 */
export type Address = `0x${string}`

/**
 * An Hash is a string representing a transaction hash.
 */
export type Hash = `0x${string}`

/**
 * A UUID is a string
 */
export type UUID = string

/**
 * A Uint256 is either a string, a number, or a BigNumber
 */
export type Uint256 = BigNumberish

/**
 * PriceNative is the price of an asset in the native token of the chain
 */
export type PriceNative = {
  /**
   * The amount of the native token. This amount should be in the smallest unit of the token (eg: wei for ETH)
   * @type Uint256
   */
  amount: Uint256
  /**
   * The address of the native token. This should be set to `null` when the native token of the chain is used
   */
  currency: null
}

/**
 * PriceERC20 is the price of an asset in an ERC20 token
 */
export type PriceERC20 = {
  /**
   * The amount of the ERC20 token. This amount should be in the smallest unit of the token (eg: 1e18 for 1 TokenX)
   * @type Uint256
   */
  amount: Uint256
  /**
   * The address of the ERC20 token. If not set, the native token of the chain will be used
   * @type Address
   */
  currency: Address
}

export interface IState<Type = string, Payload = any> {
  type: Type
  payload: Payload
}
