import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { CancelOfferStep } from '@nft/hooks'
import { CgArrowLongRight } from '@react-icons/all-files/cg/CgArrowLongRight'
import { HiOutlineExternalLink } from '@react-icons/all-files/hi/HiOutlineExternalLink'
import useTranslation from 'next-translate/useTranslation'
import React, { FC, useMemo } from 'react'
import Link from '../Link/Link'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  step: CancelOfferStep
  blockExplorer: BlockExplorer
  transactionHash: string | undefined
}

const CancelOfferModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  step,
  blockExplorer,
  transactionHash,
}) => {
  const { t } = useTranslation('components')
  const transaction = useMemo(() => {
    switch (step) {
      case CancelOfferStep.TRANSACTION_SIGNATURE:
        return {
          title: t('modal.cancel-offer.transaction.signature.title'),
          description: t(
            'modal.cancel-offer.transaction.signature.description',
          ),
          icon: <Icon as={CgArrowLongRight} h="22px" w="22px" />,
        }
      case CancelOfferStep.TRANSACTION_PENDING:
        return {
          title: t('modal.cancel-offer.transaction.pending.title'),
          description: t('modal.cancel-offer.transaction.pending.description'),
          icon: <Spinner h={6} w={6} thickness="2px" speed="0.65s" />,
        }
      default:
        return null
    }
  }, [step, t])

  if (step === CancelOfferStep.INITIAL) return null
  if (!transaction) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isCentered
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h3" variant="heading1">
            {title}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Text as="p" variant="text" mb={4}>
            {t('modal.cancel-offer.description')}
          </Text>

          <Flex align="center" gap={3}>
            <Flex align="center" justify="center" h="44px" w="44px">
              {transaction.icon}
            </Flex>
            <Box flex={1}>
              <Heading as="h4" variant="heading2">
                {transaction.title}
              </Heading>
              <Text as="p" variant="text-sm">
                {transaction.description}
              </Text>
            </Box>
          </Flex>
        </ModalBody>
        <ModalBody>
          <Divider />
        </ModalBody>
        <ModalFooter as="div">
          <Button
            as={Link}
            href={blockExplorer.transaction(transactionHash) || ''}
            isExternal
            variant="outline"
            colorScheme="gray"
            isFullWidth
            rightIcon={<HiOutlineExternalLink />}
            disabled={!transactionHash}
          >
            <Text as="span" isTruncated>
              {t('modal.cancel-offer.action', blockExplorer)}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CancelOfferModal
