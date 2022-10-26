import { Box, Flex, Text } from '@chakra-ui/react'
import { dateFromNow } from '@nft/hooks'
import React, { useMemo } from 'react'
import invariant from 'ts-invariant'
import { AccountVerificationStatus, NotificationAction } from '../graphql'
import Image from '../Image/Image'
import Link from '../Link/Link'
import AccountImage from '../Wallet/Image'
import {
  AccountVerificationValidated,
  AuctionBidCreated,
  AuctionBidExpired,
  AuctionEndedNoBids,
  AuctionEndedReservePriceBuyer,
  AuctionEndedReservePriceSeller,
  AuctionEndedWonBuyer,
  AuctionEndedWonSeller,
  AuctionExpired,
  AuctionExpireSoon,
  BidAccepted,
  BidCreated,
  BidExpired,
  OfferExpired,
  OfferPurchased,
  ReferralRefereeRegistered,
} from './types/index'

export type IProps = {
  createdAt: Date
  action: NotificationAction
  accountVerification: {
    status: AccountVerificationStatus
    account: {
      address: string
      image: string | null
    }
  } | null
  auction: {
    asset: {
      id: string
      image: string
      name: string
    }
  } | null
  offer: {
    amount: string
    unitPrice: string
    quantity: string
    asset: {
      id: string
      image: string
      name: string
    }
    currency: {
      decimals: number
      symbol: string
    }
  } | null
  trade: {
    quantity: string
    buyerAddress: string
    buyer: {
      username: string | null
    } | null
  } | null
  refereeAccount: {
    address: string
    username: string | null
    image: string | null
  } | null
}

export default function NotificationDetail({
  action,
  createdAt,
  accountVerification,
  auction,
  offer,
  trade,
  refereeAccount,
  ...props
}: IProps): JSX.Element {
  const content:
    | {
        link: string
        children: JSX.Element
        image: string
      }
    | {
        link: string
        children: JSX.Element
        userImage: string | null
        userAddress: string
      }
    | undefined = useMemo(() => {
    switch (action) {
      case NotificationAction.AccountVerificationValidated:
        invariant(accountVerification, 'accountVerification is required')
        return AccountVerificationValidated({ accountVerification })

      case NotificationAction.OfferPurchased:
        invariant(offer, 'offer is required')
        return OfferPurchased({ offer, trade })

      case NotificationAction.BidAccepted:
        invariant(offer, 'offer is required')
        return BidAccepted({ offer })

      case NotificationAction.BidCreated:
        invariant(offer, 'offer is required')
        return BidCreated({ offer })

      case NotificationAction.AuctionBidCreated:
        invariant(auction, 'auction is required')
        invariant(offer, 'offer is required')
        return AuctionBidCreated({ auction, offer })

      case NotificationAction.AuctionBidExpired:
        invariant(auction, 'auction is required')
        invariant(offer, 'offer is required')
        return AuctionBidExpired({ auction, offer })

      case NotificationAction.AuctionEndedWonSeller:
        invariant(auction, 'auction is required')
        invariant(offer, 'offer is required')
        return AuctionEndedWonSeller({ auction, offer })

      case NotificationAction.AuctionEndedReservepriceSeller:
        invariant(auction, 'auction is required')
        return AuctionEndedReservePriceSeller({ auction })

      case NotificationAction.AuctionEndedNobids:
        invariant(auction, 'auction is required')
        return AuctionEndedNoBids({ auction })

      case NotificationAction.AuctionEndedWonBuyer:
        invariant(auction, 'auction is required')
        return AuctionEndedWonBuyer({ auction })

      case NotificationAction.AuctionEndedReservepriceBuyer:
        invariant(auction, 'auction is required')
        return AuctionEndedReservePriceBuyer({ auction })

      case NotificationAction.AuctionExpireSoon:
        invariant(auction, 'auction is required')
        invariant(offer, 'offer is required')
        return AuctionExpireSoon({ auction, offer })

      case NotificationAction.AuctionExpired:
        invariant(auction, 'auction is required')
        return AuctionExpired({ auction })

      case NotificationAction.BidExpired:
        invariant(offer, 'offer is required')
        return BidExpired({ offer })

      case NotificationAction.OfferExpired:
        invariant(offer, 'sale is required')
        return OfferExpired({ offer })

      case NotificationAction.ReferralRefereeRegistered:
        invariant(refereeAccount, 'refereeAccount is required')
        return ReferralRefereeRegistered({ refereeAccount })
    }
  }, [accountVerification, action, auction, offer, trade, refereeAccount])

  if (!content) return <></>
  return (
    <Link href={content.link}>
      <Flex align="center" gap={4} {...props}>
        {'image' in content && (
          <div>
            <Box
              position="relative"
              h={14}
              w={14}
              overflow="hidden"
              bgColor="gray.100"
              rounded="sm"
            >
              <Image
                src={content.image}
                alt="Square Image"
                layout="fill"
                objectFit="cover"
              />
            </Box>
          </div>
        )}
        {/* Fallback to avatar if image is not set but userAddress is set. userImage is optional */}
        {'userAddress' in content && 'userImage' in content && (
          <div>
            <Box
              position="relative"
              h={14}
              w={14}
              overflow="hidden"
              bgColor="gray.100"
              rounded="full"
            >
              <AccountImage
                address={content.userAddress}
                image={content.userImage}
                size={56}
              />
            </Box>
          </div>
        )}
        <Box>
          <Text variant="caption" color="brand.black">
            {content.children}
            <Text as="span" ml={1} color="gray.500">
              {dateFromNow(createdAt)}
            </Text>
          </Text>
        </Box>
      </Flex>
    </Link>
  )
}
