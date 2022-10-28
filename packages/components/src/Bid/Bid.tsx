import {
  Button,
  Divider,
  Flex,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import {
  AcceptOfferStep,
  CancelOfferStep,
  dateFromNow,
  formatDate,
  isSameAddress,
  useAcceptOffer,
  useCancelOffer,
} from '@nft/hooks'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import React, { SyntheticEvent, useMemo, VFC } from 'react'
import Link from '../Link/Link'
import { ListItem } from '../List/List'
import AcceptOfferModal from '../Modal/AcceptOffer'
import CancelOfferModal from '../Modal/CancelOffer'
import Price from '../Price/Price'
import WalletAddress from '../Wallet/Address'
import AccountImage from '../Wallet/Image'

export type Props = {
  bid: {
    id: string
    createdAt: Date
    expiredAt: Date | null | undefined
    unitPrice: BigNumber
    availableQuantity: BigNumber
    currency: {
      decimals: number
      symbol: string
    }
    maker: {
      address: string
      name: string | null | undefined
      image: string | null | undefined
      verified: boolean
    }
  }
  signer: Signer | undefined
  account: string | null | undefined
  blockExplorer: BlockExplorer
  isSingle: boolean
  preventAcceptation: boolean
  onAccepted: (id: string) => Promise<void>
  onCanceled: (id: string) => Promise<void>
}

const Bid: VFC<Props> = ({
  bid,
  signer,
  account,
  blockExplorer,
  isSingle,
  preventAcceptation,
  onAccepted,
  onCanceled,
}) => {
  const { t } = useTranslation('components')
  const {
    isOpen: acceptOfferIsOpen,
    onOpen: acceptOfferOnOpen,
    onClose: acceptOfferOnClose,
  } = useDisclosure()
  const {
    isOpen: cancelOfferIsOpen,
    onOpen: cancelOfferOnOpen,
    onClose: cancelOfferOnClose,
  } = useDisclosure()

  const [
    acceptOffer,
    { activeStep: activeAcceptOfferStep, transactionHash: acceptOfferHash },
  ] = useAcceptOffer(signer)
  const [
    cancelOffer,
    { activeStep: activeCancelOfferStep, transactionHash: cancelOfferHash },
  ] = useCancelOffer(signer)

  const canAccept = useMemo(() => {
    if (!account) return false
    if (preventAcceptation) return false
    return !isSameAddress(bid.maker.address, account)
  }, [account, bid, preventAcceptation])

  const canCancel = useMemo(() => {
    if (!account) return false
    return isSameAddress(account, bid.maker.address)
  }, [account, bid])

  const acceptBid = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!canAccept) return
    if (activeAcceptOfferStep !== AcceptOfferStep.INITIAL) return
    try {
      acceptOfferOnOpen()
      await acceptOffer(bid, bid.availableQuantity)
      await onAccepted(bid.id)
    } finally {
      acceptOfferOnClose()
    }
  }

  const cancelBid = async (e: SyntheticEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!canCancel) return
    if (activeCancelOfferStep !== CancelOfferStep.INITIAL) return
    try {
      cancelOfferOnOpen()
      await cancelOffer(bid)
      await onCanceled(bid.id)
    } finally {
      cancelOfferOnClose()
    }
  }

  return (
    <>
      <ListItem
        image={
          <Link href={`/users/${bid.maker.address}`}>
            <Flex
              as={AccountImage}
              address={bid.maker.address}
              image={bid.maker.image}
              size={40}
              cursor="pointer"
            />
          </Link>
        }
        label={
          <Flex gap={2}>
            <span>
              <Trans
                ns="components"
                i18nKey={
                  isSingle
                    ? 'bid.detail.per-edition-single'
                    : 'bid.detail.per-edition-multiple'
                }
                components={[
                  <Text
                    as={Price}
                    amount={bid.unitPrice}
                    currency={bid.currency}
                    fontWeight="medium"
                  />,
                ]}
              />
            </span>
            {!isSingle && (
              <Flex as="span">
                <Divider orientation="vertical" />
                <span>
                  <Trans
                    ns="components"
                    i18nKey="bid.detail.requested"
                    components={[<Text as="span" ml={2} fontWeight="medium" />]}
                    values={{ quantity: bid.availableQuantity.toString() }}
                  />
                </span>
              </Flex>
            )}
          </Flex>
        }
        subtitle={
          <Link href={`/users/${bid.maker.address}`}>
            <Flex as="span" align="center" gap={1.5} cursor="pointer">
              <Text
                as="span"
                title={bid.maker.name || bid.maker.address}
                fontWeight="medium"
                fontSize="sm"
              >
                {bid.maker.name || (
                  <WalletAddress address={bid.maker.address} isShort />
                )}
              </Text>
              {bid.maker.verified && <Icon as={HiBadgeCheck} h={4} w={4} />}
            </Flex>
          </Link>
        }
        caption={
          <Text as="span">
            {dateFromNow(bid.createdAt)}
            {bid.expiredAt &&
              t('bid.detail.expires', { date: formatDate(bid.expiredAt) })}
          </Text>
        }
        action={
          <>
            {canAccept && (
              <Button
                w={{ base: 'full', md: 'auto' }}
                isLoading={activeAcceptOfferStep !== AcceptOfferStep.INITIAL}
                onClick={acceptBid}
              >
                <Text as="span" isTruncated>
                  {t('bid.detail.accept')}
                </Text>
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                w={{ base: 'full', md: 'auto' }}
                isLoading={activeCancelOfferStep !== CancelOfferStep.INITIAL}
                onClick={cancelBid}
              >
                <Text as="span" isTruncated>
                  {t('bid.detail.cancel')}
                </Text>
              </Button>
            )}
          </>
        }
      />

      <AcceptOfferModal
        isOpen={acceptOfferIsOpen}
        onClose={acceptOfferOnClose}
        title={t('bid.detail.modal.accept.title')}
        step={activeAcceptOfferStep}
        blockExplorer={blockExplorer}
        transactionHash={acceptOfferHash}
      />
      <CancelOfferModal
        isOpen={cancelOfferIsOpen}
        onClose={cancelOfferOnClose}
        title={t('bid.detail.modal.cancel.title')}
        step={activeCancelOfferStep}
        blockExplorer={blockExplorer}
        transactionHash={cancelOfferHash}
      />
    </>
  )
}

export default Bid
