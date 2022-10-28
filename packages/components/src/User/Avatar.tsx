import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import React, { VFC } from 'react'
import Link from '../Link/Link'
import WalletAddress from '../Wallet/Address'
import AccountImage from '../Wallet/Image'

type Props = {
  address: string
  name: string | null | undefined
  image: string | null | undefined
  verified: boolean
}

const Avatar: VFC<Props> = ({ address, name, image, verified }) => {
  return (
    <Link display="block" flexShrink={0} href={`/users/${address}`}>
      <Flex align="center" gap={2}>
        <Box
          as={AccountImage}
          rounded="full"
          address={address}
          image={image}
          size={32}
          w={8}
          h={8}
        />
        <Text as="span" variant="subtitle2">
          {name || <WalletAddress address={address} isShort />}
        </Text>
        {verified && (
          <Flex align="center" h={4} w={4}>
            <Icon as={HiBadgeCheck} />
          </Flex>
        )}
      </Flex>
    </Link>
  )
}

export default Avatar
