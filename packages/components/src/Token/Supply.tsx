import { Flex, Icon, Text } from '@chakra-ui/react'
import { BigNumber } from '@ethersproject/bignumber'
import { IoImagesOutline } from '@react-icons/all-files/io5/IoImagesOutline'
import useTranslation from 'next-translate/useTranslation'
import React, { VFC } from 'react'

const Supply: VFC<{
  current: BigNumber
  total: BigNumber
  small?: boolean
}> = ({ current, total, small }) => {
  const { t } = useTranslation('components')
  return (
    <Flex align="center" py={1.5} pl={1}>
      <Icon as={IoImagesOutline} mr={2} h={4} w={4} />
      {small ? (
        <Text as="span" variant="text-sm">
          {current.toString()}/{total.toString()}
        </Text>
      ) : (
        <Text as="span" variant="subtitle2">
          {t('token.supply.available', {
            current: current.toString(),
            total: total.toString(),
          })}
        </Text>
      )}
    </Flex>
  )
}

export default Supply
