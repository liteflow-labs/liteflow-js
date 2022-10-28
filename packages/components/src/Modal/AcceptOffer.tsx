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
  Stack,
  Text,
} from '@chakra-ui/react'
import { AcceptOfferStep } from '@nft/hooks'
import { CgArrowLongRight } from '@react-icons/all-files/cg/CgArrowLongRight'
import { HiCheck } from '@react-icons/all-files/hi/HiCheck'
import { HiOutlineExternalLink } from '@react-icons/all-files/hi/HiOutlineExternalLink'
import useTranslation from 'next-translate/useTranslation'
import React, { FC, useMemo } from 'react'
import Link from '../Link/Link'

type Props = {
  isOpen: boolean
  onClose: () => void
  title: string
  step: AcceptOfferStep
  blockExplorer: BlockExplorer
  transactionHash: string | undefined
}

const AcceptOfferModal: FC<Props> = ({
  isOpen,
  onClose,
  title,
  step,
  blockExplorer,
  transactionHash,
}) => {
  const { t } = useTranslation('components')
  const approval = useMemo(() => {
    switch (step) {
      case AcceptOfferStep.APPROVAL_SIGNATURE:
        return {
          title: t('modal.accept-offer.approval.signature.title'),
          description: t('modal.accept-offer.approval.signature.description'),
          icon: <Icon as={CgArrowLongRight} h="22px" w="22px" />,
        }
      case AcceptOfferStep.APPROVAL_PENDING:
        return {
          title: t('modal.accept-offer.approval.pending.title'),
          description: t('modal.accept-offer.approval.pending.description'),
          icon: <Spinner h={6} w={6} thickness="2px" speed="0.65s" />,
        }
      case AcceptOfferStep.TRANSACTION_SIGNATURE:
      case AcceptOfferStep.TRANSACTION_PENDING:
      case AcceptOfferStep.OWNERSHIP:
        return {
          title: t('modal.accept-offer.approval.default.title'),
          description: t('modal.accept-offer.approval.default.description'),
          icon: <Icon as={HiCheck} h={7} w={7} color="green.500" />,
        }
      default:
        return null
    }
  }, [step, t])

  const transaction = useMemo(() => {
    switch (step) {
      case AcceptOfferStep.APPROVAL_SIGNATURE:
      case AcceptOfferStep.APPROVAL_PENDING:
        return {
          title: t('modal.accept-offer.transaction.approval.title'),
          description: t('modal.accept-offer.transaction.approval.description'),
          icon: <Icon as={CgArrowLongRight} h="22px" w="22px" />,
        }
      case AcceptOfferStep.TRANSACTION_SIGNATURE:
        return {
          title: t('modal.accept-offer.transaction.signature.title'),
          description: t(
            'modal.accept-offer.transaction.signature.description',
          ),
          icon: <Icon as={CgArrowLongRight} h="22px" w="22px" />,
        }
      case AcceptOfferStep.TRANSACTION_PENDING:
        return {
          title: t('modal.accept-offer.transaction.pending.title'),
          description: t('modal.accept-offer.transaction.pending.description'),
          icon: <Spinner h={6} w={6} thickness="2px" speed="0.65s" />,
        }
      case AcceptOfferStep.OWNERSHIP:
        return {
          title: t('modal.accept-offer.transaction.ownership.title'),
          description: t(
            'modal.accept-offer.transaction.ownership.description',
          ),
          icon: <Spinner h={6} w={6} thickness="2px" speed="0.65s" />,
        }
      default:
        return null
    }
  }, [step, t])

  if (step === AcceptOfferStep.INITIAL) return null
  if (!approval || !transaction) return null

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
            {t('modal.accept-offer.description')}
          </Text>

          <Stack spacing={4}>
            <Flex align="center" gap={3}>
              <Flex align="center" justify="center" h="44px" w="44px">
                {approval.icon}
              </Flex>
              <Box flex={1}>
                <Heading as="h4" variant="heading2">
                  {approval.title}
                </Heading>
                <Text as="p" variant="text-sm">
                  {approval.description}
                </Text>
              </Box>
            </Flex>

            <Flex
              align="center"
              gap={3}
              opacity={
                step === AcceptOfferStep.APPROVAL_SIGNATURE ||
                step === AcceptOfferStep.APPROVAL_PENDING
                  ? '.4'
                  : undefined
              }
            >
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
          </Stack>
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
              {step === AcceptOfferStep.APPROVAL_SIGNATURE ||
              step === AcceptOfferStep.APPROVAL_PENDING
                ? t('modal.accept-offer.action.permission', blockExplorer)
                : t('modal.accept-offer.action.transaction', blockExplorer)}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AcceptOfferModal
