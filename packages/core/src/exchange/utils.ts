import { BigNumber } from 'ethers'
import type { OfferFragment } from '../graphql'
import type { Address } from '../types'
import { toAddress } from '../utils/convert'

export const checkOfferValidity = async (
  offer: NonNullable<OfferFragment>,
  taker: Address,
) => {
  if (offer.expiredAt && new Date(offer.expiredAt) < new Date())
    throw new Error('Offer has expired')

  if (BigNumber.from(offer.availableQuantity).isZero())
    throw new Error('Offer is not available')

  if (offer.takerAddress && toAddress(offer.takerAddress) !== taker)
    throw new Error('Offer is not for you')

  if (toAddress(offer.makerAddress) === toAddress(taker))
    throw new Error('You can not accept your own offer')

  // TODO: Check if the maker still has the asset
  // TODO: Check if the maker has authorized the transfer

  // Except front running, the offer should be valid at this point
}
