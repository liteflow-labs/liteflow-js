import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import {
  CancelOfferStep,
  formatDate,
  formatError,
  isSameAddress,
  useCancelOffer,
} from '@nft/hooks'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, VFC } from 'react'
import Link from '../../Link/Link'
import { ListItem } from '../../List/List'
import CancelOfferModal from '../../Modal/CancelOffer'
import Price from '../../Price/Price'
import WalletAddress from '../../Wallet/Address'
import AccountImage from '../../Wallet/Image'

export type Props = {
  blockExplorer: BlockExplorer
  signer: Signer | undefined
  currentAccount: string | null | undefined
  sale: {
    id: string
    expiredAt: Date | null | undefined
    maker: {
      address: string
      image: string | null | undefined
      name: string | null | undefined
      verified: boolean
    }
    unitPrice: BigNumber
    availableQuantity: BigNumber
    currency: {
      decimals: number
      symbol: string
    }
  }
  onOfferCanceled: (id: string) => Promise<void>
}

const SaleDirectModalItem: VFC<Props> = ({
  blockExplorer,
  sale,
  signer,
  currentAccount,
  onOfferCanceled,
}) => {
  const { t } = useTranslation('components')
  const [cancelOffer, { activeStep, transactionHash }] = useCancelOffer(signer)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleCancel = useCallback(async () => {
    if (!confirm(t('sales.direct.modal-item.cancel-confirmation'))) return
    try {
      onOpen()
      await cancelOffer(sale)
      await onOfferCanceled(sale.id)
    } catch (e) {
      toast({
        title: formatError(e),
        status: 'error',
      })
    } finally {
      onClose()
    }
  }, [cancelOffer, onClose, onOfferCanceled, onOpen, sale, t, toast])

  return (
    <>
      <ListItem
        image={
          <Flex as={Link} href={`/users/${sale.maker.address}`}>
            <Box
              as={AccountImage}
              address={sale.maker.address}
              image={sale.maker.image}
              size={40}
              w={10}
              h={10}
            />
          </Flex>
        }
        label={
          <Flex
            display="inline-flex"
            align="center"
            gap={1.5}
            as={Link}
            href={`/users/${sale.maker.address}`}
          >
            <Text
              as="span"
              color="brand.black"
              fontWeight="medium"
              title={sale.maker.name || sale.maker.address}
            >
              {sale.maker.name || (
                <WalletAddress address={sale.maker.address} isShort />
              )}
            </Text>
            {sale.maker.verified && (
              <Icon as={HiBadgeCheck} color="brand.500" h={4} w={4} />
            )}
          </Flex>
        }
        subtitle={
          <Flex direction="column" as="span">
            <span>
              <Text
                as={Price}
                color="brand.black"
                fontWeight="medium"
                amount={sale.unitPrice}
                currency={sale.currency}
              />
              {t('sales.direct.modal-item.per-edition')}
            </span>
            <span>
              {t('sales.direct.modal-item.available', {
                count: sale.availableQuantity.toNumber(),
              })}
            </span>
          </Flex>
        }
        caption={
          sale.expiredAt ? (
            <Text as="span" color="gray.400">
              {t('sales.direct.modal-item.expiration', {
                date: formatDate(sale.expiredAt),
              })}
            </Text>
          ) : undefined
        }
        action={
          !!currentAccount &&
          isSameAddress(sale.maker.address, currentAccount) ? (
            <Button
              variant="outline"
              colorScheme="gray"
              w={{ base: 'full', md: 'auto' }}
              onClick={() => handleCancel()}
              isLoading={activeStep !== CancelOfferStep.INITIAL}
              disabled={activeStep !== CancelOfferStep.INITIAL}
            >
              <Text as="span" isTruncated>
                {t('sales.direct.modal-item.cancel')}
              </Text>
            </Button>
          ) : (
            <Button as={Link} href={`/checkout/${sale.id}`}>
              <Text as="span" isTruncated>
                {t('sales.direct.modal-item.buy')}
              </Text>
            </Button>
          )
        }
      />

      <CancelOfferModal
        isOpen={isOpen}
        onClose={onClose}
        title={t('sales.direct.modal-item.cancel')}
        step={activeStep}
        blockExplorer={blockExplorer}
        transactionHash={transactionHash}
      />
    </>
  )
}

export default SaleDirectModalItem
