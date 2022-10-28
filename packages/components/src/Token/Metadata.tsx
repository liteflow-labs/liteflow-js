import { Flex, Heading, Icon, Stack, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { IoImageOutline } from '@react-icons/all-files/io5/IoImageOutline'
import useTranslation from 'next-translate/useTranslation'
import React, { VFC } from 'react'
import { Standard } from '../graphql'
import Avatar from '../User/Avatar'
import OwnersModal from './Owners/Modal'
import Supply from './Supply'

export type Props = {
  standard: Standard
  creator:
    | {
        address: string
        name: string | null | undefined
        image: string | null | undefined
        verified: boolean
      }
    | undefined
  owners: {
    address: string
    image: string | null | undefined
    name: string | null | undefined
    verified: boolean
    quantity: string
  }[]
  saleSupply: BigNumber
  totalSupply: BigNumber | null | undefined
}

const TokenAsset: VFC<Props> = ({
  standard,
  creator,
  owners,
  saleSupply,
  totalSupply,
}) => {
  const { t } = useTranslation('components')
  return (
    <Flex wrap="wrap" rowGap={6} columnGap={8}>
      {creator && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3">
            {t('token.metadata.creator')}
          </Heading>
          <Avatar
            address={creator.address}
            image={creator.image}
            name={creator.name}
            verified={creator.verified}
          />
        </Stack>
      )}
      {owners.length === 1 && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3">
            {t('token.metadata.owner')}
          </Heading>
          <Avatar
            address={owners[0].address}
            image={owners[0].image}
            name={owners[0].name}
            verified={owners[0].verified}
          />
        </Stack>
      )}
      {owners.length > 1 && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3">
            {t('token.metadata.owners')}
          </Heading>
          <OwnersModal owners={owners} />
        </Stack>
      )}
      {standard === Standard.Erc721 && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3">
            {t('token.metadata.edition')}
          </Heading>
          <Flex align="center" display="inline-flex" h="full">
            <Icon as={IoImageOutline} mr={2} h={4} w={4} />
            <Text as="span" variant="subtitle2">
              {t('token.metadata.single')}
            </Text>
          </Flex>
        </Stack>
      )}
      {standard === Standard.Erc1155 && (
        <Stack spacing={3}>
          <Heading as="h5" variant="heading3">
            {t('token.metadata.edition')}
          </Heading>
          <Supply
            current={saleSupply}
            total={totalSupply || BigNumber.from('0')}
          />
        </Stack>
      )}
    </Flex>
  )
}

export default TokenAsset
