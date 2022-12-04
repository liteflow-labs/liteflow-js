import useAcceptAuction, { AcceptAuctionStep } from './useAcceptAuction'
import useAcceptOffer, { AcceptOfferStep } from './useAcceptOffer'
import useAddFund from './useAddFund'
import useAuctionStatus from './useAuctionStatus'
import useAuthenticate from './useAuthenticate'
import useBalance from './useBalance'
import useCancelOffer, { CancelOfferStep } from './useCancelOffer'
import useConfig from './useConfig'
import useCreateAuction from './useCreateAuction'
import useCreateNFT, { CreateNftStep } from './useCreateNFT'
import useCreateOffer, { CreateOfferStep } from './useCreateOffer'
import useInvitation from './useInvitation'
import useIsLoggedIn from './useIsLoggedIn'
import useUpdateAccount from './useUpdateAccount'
import useVerifyAccount from './useVerifyAccount'
import { isSameAddress } from './utils/address'
import {
  dateFromNow,
  formatDate,
  formatDateDatetime,
  getHumanizedDate,
} from './utils/date'
import { formatAddress } from './utils/formatAddress'
import { formatError } from './utils/formatError'
import { formatSocial } from './utils/formatSocial'
import { parsePrice } from './utils/parsePrice'
import { removeEmptyFromObject } from './utils/removeEmptyFromObject'

export { LiteflowProvider } from './context'
export type { LiteflowProviderProps } from './context'
export {
  /**
   * Stable
   * These hooks are ready to use and are unlikely to have breaking change
   */
  useConfig,
  useAcceptAuction,
  useAcceptOffer,
  useAuthenticate,
  useCancelOffer,
  useCreateAuction,
  useCreateNFT,
  useCreateOffer,
  useInvitation,
  useUpdateAccount,
  useVerifyAccount,
  AcceptAuctionStep,
  AcceptOfferStep,
  CancelOfferStep,
  CreateNftStep,
  CreateOfferStep,
  /**
   * Release candidate
   * This is not documented and may be removed anytime
   * These hooks may be included in the library when considered stable
   */
  useAuctionStatus,
  useAddFund,
  /**
   * Deprecated
   * These hooks will be removed in future release
   * Avoid as possible to ensure compatibility with future versions
   */
  /** @deprecated */
  useBalance,
  /** @deprecated */
  useIsLoggedIn,
  /**
   * helpers
   * Helper functions that are likely to change either by moving into a dedicated
   * export or a dedicated library (or any equivalent third party library)
   */
  formatAddress,
  formatDate,
  formatDateDatetime,
  dateFromNow,
  getHumanizedDate,
  formatSocial,
  isSameAddress,
  removeEmptyFromObject,
  parsePrice,
  formatError,
}
