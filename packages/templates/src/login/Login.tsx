import { Box, Flex, Heading, Stack, Text, useToast } from '@chakra-ui/react'
import {
  BackButton,
  CoinbaseConnector,
  EmailConnector,
  MetamaskConnector,
  WalletConnectConnector,
} from '@nft/components'
import { useInvitation, useSession } from '@nft/hooks'
import { UnsupportedChainIdError } from '@web3-react/core'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState, VFC } from 'react'

type Props = {
  email: boolean
  metamask: boolean
  coinbase: boolean
  walletConnect: boolean
  networkName: string
}

export const Template: VFC<Props> = ({
  email,
  coinbase,
  metamask,
  walletConnect,
  networkName,
}) => {
  const { t } = useTranslation('templates')
  const { back, query, replace } = useRouter()
  const referral = Array.isArray(query.ref) ? query.ref[0] : query.ref
  const { account, signer, error } = useSession()
  const { accept } = useInvitation(signer)
  const toast = useToast()
  const [errorFromLogin, setErrorFromLogin] = useState<Error>()

  const invalidNetwork = useMemo(
    () => errorFromLogin && errorFromLogin instanceof UnsupportedChainIdError,
    [errorFromLogin],
  )

  const handleAuthenticated = useCallback(async () => {
    if (!referral) return
    try {
      await accept(referral)
      toast({
        title: t('login.successes.invitation'),
        status: 'success',
      })
    } catch (error) {
      console.warn(error)
      toast({
        title: t('login.errors.invitation'),
        status: 'warning',
      })
    }
  }, [accept, referral, t, toast])

  const redirect = useCallback(() => {
    if (query.redirectTo && !Array.isArray(query.redirectTo))
      return void replace(query.redirectTo)
    void replace('/')
  }, [query, replace])

  // redirect user if account is found
  useEffect(() => {
    if (!account) return
    redirect()
  }, [account, redirect])

  const hasStandardWallet = useMemo(
    () => metamask || coinbase || walletConnect,
    [metamask, coinbase, walletConnect],
  )

  return (
    <>
      <Box as={BackButton} mt={10} onClick={back} />
      <Heading as="h1" variant="title" color="brand.black" mt={12}>
        {t('login.title')}
      </Heading>
      <Heading
        as="h2"
        variant="subtitle"
        fontWeight={500}
        color="gray.500"
        mt={3}
      >
        {t('login.subtitle')}
      </Heading>
      <Text as="p" variant="text" color="gray.500" mt={3}>
        {t('login.description')}
      </Text>
      <Flex
        direction="column"
        mt={12}
        mb={{ base: 12, lg: 24 }}
        justify="center"
      >
        {email && <EmailConnector onAuthenticated={handleAuthenticated} />}

        {email && hasStandardWallet && (
          <Flex mt={12} position="relative">
            <Flex
              position="absolute"
              align="center"
              top={0}
              left={0}
              bottom={0}
              right={0}
            >
              <Box w="full" borderTop="1px" borderColor="gray.200" />
            </Flex>
            <Box as="span" position="relative" bgColor="white" pr={2}>
              <Text as="p" variant="text-sm" fontWeight={500} color="gray.500">
                {t('login.alternative')}
              </Text>
            </Box>
          </Flex>
        )}

        {error && (
          <Text as="span" role="alert" variant="error" mt={3}>
            {error.message ? error.message : error.toString()}
          </Text>
        )}
        {invalidNetwork && (
          <Text as="span" role="alert" variant="error" mt={3}>
            {t('login.errors.wrong-network', { networkName })}
          </Text>
        )}
        {hasStandardWallet && (
          <Flex
            as="nav"
            direction={{ base: 'column', md: 'row' }}
            mt={6}
            gap={6}
          >
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
                <MetamaskConnector
                  onError={setErrorFromLogin}
                  onAuthenticated={handleAuthenticated}
                />
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
                <CoinbaseConnector
                  onError={setErrorFromLogin}
                  onAuthenticated={handleAuthenticated}
                />
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
                <WalletConnectConnector
                  onError={setErrorFromLogin}
                  onAuthenticated={handleAuthenticated}
                />
              </Stack>
            )}
          </Flex>
        )}
      </Flex>
    </>
  )
}