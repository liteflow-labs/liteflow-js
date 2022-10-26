import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useSession } from '@nft/hooks'
import { UnsupportedChainIdError } from '@web3-react/core'
import useTranslation from 'next-translate/useTranslation'
import React, { FC, useEffect, useMemo, useState } from 'react'
import WalletCoinbase from '../Wallet/Connectors/Coinbase'
import WalletEmail from '../Wallet/Connectors/Email'
import WalletMetamask from '../Wallet/Connectors/Metamask'
import WalletWalletConnect from '../Wallet/Connectors/WalletConnect'

type Props = {
  isOpen: boolean
  onClose: () => void
  email: boolean
  metamask: boolean
  coinbase: boolean
  walletConnect: boolean
  networkName: string
}

const LoginModal: FC<Props> = ({
  isOpen,
  onClose,
  email,
  coinbase,
  metamask,
  walletConnect,
  networkName,
}) => {
  const { t } = useTranslation('components')
  const { account, error } = useSession()
  const [errorFromLogin, setErrorFromLogin] = useState<Error>()

  const invalidNetwork = useMemo(
    () => errorFromLogin && errorFromLogin instanceof UnsupportedChainIdError,
    [errorFromLogin],
  )

  const hasStandardWallet = useMemo(
    () => metamask || coinbase || walletConnect,
    [metamask, coinbase, walletConnect],
  )

  useEffect(() => {
    if (account) onClose()
  }, [account, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h3" variant="heading1" color="brand.black">
            {t('modal.login.title')}
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text as="p" variant="text" color="gray.500" mb={4}>
            {t('modal.login.description')}
          </Text>

          {email && <WalletEmail />}
          {email && hasStandardWallet && (
            <Box position="relative" mt={6} mb={2}>
              <Flex
                position="absolute"
                align="center"
                top={0}
                right={0}
                bottom={0}
                left={0}
              >
                <Box w="full" borderTop="1px" borderColor="gray.200" />
              </Flex>
              <Flex position="relative" bgColor="white" pr={2}>
                <Text
                  as="p"
                  variant="text-sm"
                  fontWeight={500}
                  color="gray.500"
                >
                  {t('modal.login.alternative')}
                </Text>
              </Flex>
            </Box>
          )}

          {error && (
            <Text as="span" role="alert" variant="error" mt={3}>
              {error.message ? error.message : error.toString()}
            </Text>
          )}
          {invalidNetwork && (
            <Text as="span" role="alert" variant="error" mt={3}>
              {t('modal.login.errors.wrong-network', { networkName })}
            </Text>
          )}
          {hasStandardWallet && (
            <Flex direction={{ base: 'column', md: 'row' }} gap={3}>
              {metamask && (
                <Stack
                  cursor="pointer"
                  w="full"
                  spacing={3}
                  rounded="xl"
                  borderWidth={1}
                  borderColor="gray.200"
                  shadow="sm"
                  _hover={{
                    shadow: 'md',
                  }}
                  transition="box-shadow 0.3s ease-in-out"
                >
                  <WalletMetamask onError={setErrorFromLogin} />
                </Stack>
              )}
              {coinbase && (
                <Stack
                  cursor="pointer"
                  w="full"
                  spacing={3}
                  rounded="xl"
                  borderWidth={1}
                  borderColor="gray.200"
                  shadow="sm"
                  _hover={{
                    shadow: 'md',
                  }}
                  transition="box-shadow 0.3s ease-in-out"
                >
                  <WalletCoinbase onError={setErrorFromLogin} />
                </Stack>
              )}
              {walletConnect && (
                <Stack
                  cursor="pointer"
                  w="full"
                  spacing={3}
                  rounded="xl"
                  borderWidth={1}
                  borderColor="gray.200"
                  shadow="sm"
                  _hover={{
                    shadow: 'md',
                  }}
                  transition="box-shadow 0.3s ease-in-out"
                >
                  <WalletWalletConnect onError={setErrorFromLogin} />
                </Stack>
              )}
            </Flex>
          )}
        </ModalBody>
        <ModalFooter as="div" />
      </ModalContent>
    </Modal>
  )
}

export default LoginModal
