import { Signer } from '@ethersproject/abstract-signer'
import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import {
  Box,
  Flex,
  Heading,
  Icon,
  ListItem,
  OrderedList,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { ReferralForm } from '@nft/components'
import { AiFillInfoCircle } from '@react-icons/all-files/ai/AiFillInfoCircle'
import useTranslation from 'next-translate/useTranslation'
import React, { VFC } from 'react'

type Props = {
  platformName: string
  percentage: {
    base: number
    secondary?: number
  }
  loginUrl: string
  login: {
    email?: EmailConnector
    injected?: InjectedConnector
    walletConnect?: WalletConnectConnector
    coinbase?: WalletLinkConnector
    networkName: string
  }
  signer: Signer | undefined
}

export const Template: VFC<Props> = ({
  platformName,
  percentage,
  login,
  loginUrl,
  signer,
}) => {
  const { t } = useTranslation('templates')
  return (
    <Stack spacing={8}>
      <Heading variant="title">{t('referral.title')}</Heading>
      <Text>{t('referral.description', { platformName })}</Text>

      <div>
        <Heading variant="subtitle" pb={4}>
          {t('referral.link')}
        </Heading>
        <ReferralForm login={login} loginUrl={loginUrl} signer={signer} />
      </div>

      <div>
        <Heading variant="subtitle" pb={4}>
          {t('referral.how.title')}
        </Heading>
        <OrderedList>
          <ListItem>
            <Text>{t('referral.how.steps.0')}</Text>
          </ListItem>
          <ListItem>
            <Text>{t('referral.how.steps.1')}</Text>
          </ListItem>
          <ListItem>
            <Text>{t('referral.how.steps.2')}</Text>
          </ListItem>
          <ListItem>
            <Text>{t('referral.how.steps.3')}</Text>
          </ListItem>
        </OrderedList>
      </div>

      <div>
        <Heading variant="subtitle" pb={4}>
          {t('referral.rewards.title')}
        </Heading>
        <SimpleGrid columns={{ sm: percentage.secondary ? 2 : 1 }}>
          <Box pb={4}>
            {!!percentage.secondary && (
              <Flex as={Text} pb={4} fontWeight="bold" align="center" gap={2}>
                {t('referral.rewards.primary.title')}
                <Tooltip
                  cursor="pointer"
                  label={t('referral.rewards.primary.tooltip')}
                >
                  <span>
                    <Icon as={AiFillInfoCircle} color="gray.500" />
                  </span>
                </Tooltip>
              </Flex>
            )}
            <Text>
              {t('referral.rewards.primary.description', {
                percentage: percentage.base,
              })}
            </Text>
          </Box>
          {percentage.secondary && (
            <Box pb={4}>
              <Flex as={Text} pb={4} fontWeight="bold" align="center" gap={2}>
                {t('referral.rewards.secondary.title')}
                <Tooltip
                  cursor="pointer"
                  label={t('referral.rewards.secondary.tooltip')}
                >
                  <span>
                    <Icon as={AiFillInfoCircle} color="gray.500" />
                  </span>
                </Tooltip>
              </Flex>
              <Text>
                {t('referral.rewards.secondary.description', {
                  percentage: percentage.secondary,
                })}
              </Text>
            </Box>
          )}
        </SimpleGrid>
      </div>
    </Stack>
  )
}
