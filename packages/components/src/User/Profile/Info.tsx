import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import {
  formatError,
  useInvitation,
  useIsLoggedIn,
  useSession,
} from '@nft/hooks'
import { BsArrowRight } from '@react-icons/all-files/bs/BsArrowRight'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import { HiOutlineClipboard } from '@react-icons/all-files/hi/HiOutlineClipboard'
import { HiOutlineGlobeAlt } from '@react-icons/all-files/hi/HiOutlineGlobeAlt'
import { SiInstagram } from '@react-icons/all-files/si/SiInstagram'
import { SiTwitter } from '@react-icons/all-files/si/SiTwitter'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useEffect, useState, VFC } from 'react'
import Link from '../../Link/Link'
import WalletAddress from '../../Wallet/Address'

const UserProfileInfo: VFC<{
  signer: Signer | undefined
  address: string
  name: string | null | undefined
  description: string | null | undefined
  twitter: string | null | undefined
  instagram: string | null | undefined
  website: string | null | undefined
  verified: boolean
  loginUrlForReferral?: string
}> = ({
  signer,
  address,
  description,
  instagram,
  name,
  twitter,
  verified,
  website,
  loginUrlForReferral,
}) => {
  const { t } = useTranslation('components')
  const { create: createReferralLink, creating: creatingReferralLink } =
    useInvitation(signer)
  const { account } = useSession()
  const toast = useToast()
  const [referralUrl, setReferralUrl] = useState<string>()

  if (!address) throw new Error('account is falsy')

  const ownerLoggedIn = useIsLoggedIn(address)

  useEffect(() => {
    if (!account) return
    if (referralUrl) return
    if (!loginUrlForReferral) return
    createReferralLink()
      .then((id) => setReferralUrl(`${loginUrlForReferral}?ref=${id}`))
      .catch((error) =>
        toast({
          title: formatError(error),
          status: 'error',
        }),
      )
  }, [referralUrl, account, createReferralLink, loginUrlForReferral, toast])

  const handleReferralCopyLink = useCallback(() => {
    if (!referralUrl) return
    void navigator.clipboard.writeText(referralUrl)
    toast({
      title: t('referral.form.copy'),
      status: 'success',
    })
  }, [referralUrl, t, toast])

  return (
    <VStack as="aside" spacing={8} align="flex-start" px={6}>
      {name && (
        <Box>
          <Heading as="h1" variant="title" overflowWrap="break-word">
            {name}
          </Heading>
          {verified && (
            <Flex mt={2} align="center" gap={1}>
              <Icon as={HiBadgeCheck} /> <span>{t('user.info.verified')}</span>
            </Flex>
          )}
        </Box>
      )}
      <Button variant="outline" colorScheme="gray">
        <WalletAddress address={address} isCopyable isShort />
      </Button>

      {ownerLoggedIn && (
        <Button
          as={Link}
          href={`/account/edit`}
          variant="outline"
          colorScheme="gray"
        >
          <Text as="span" isTruncated>
            {t('user.info.edit')}
          </Text>
        </Button>
      )}

      {description && (
        <Stack spacing={3}>
          <Heading as="h4" variant="heading2">
            {t('user.info.bio')}
          </Heading>
          <Text as="p" variant="text-sm">
            {description}
          </Text>
        </Stack>
      )}

      <VStack as="nav" spacing={3} align="flex-start">
        {twitter && (
          <Button
            as={Link}
            href={`https://twitter.com/${twitter}`}
            isExternal
            variant="outline"
            colorScheme="gray"
            w={40}
            justifyContent="space-between"
            rightIcon={<Icon as={SiTwitter} />}
          >
            <Text as="span" isTruncated>
              @{twitter}
            </Text>
          </Button>
        )}
        {instagram && (
          <Button
            as={Link}
            href={`https://instagram.com/${instagram}`}
            isExternal
            variant="outline"
            colorScheme="gray"
            w={40}
            justifyContent="space-between"
            rightIcon={<Icon as={SiInstagram} />}
          >
            <Text as="span" isTruncated>
              @{instagram}
            </Text>
          </Button>
        )}
        {website && (
          <Button
            as={Link}
            href={website.includes('http') ? website : `https://${website}`}
            isExternal
            variant="outline"
            colorScheme="gray"
            w={40}
            justifyContent="space-between"
            rightIcon={<Icon as={HiOutlineGlobeAlt} />}
          >
            <Text as="span" isTruncated>
              {website.replace(/^https?\:\/\//i, '')}
            </Text>
          </Button>
        )}
      </VStack>

      {ownerLoggedIn && loginUrlForReferral && (
        <Stack spacing={4} maxW="100%">
          <Heading as="h4" variant="heading2">
            {t('user.referral.title')}
          </Heading>
          <Text>{t('user.referral.description')}</Text>
          <Button
            variant="outline"
            isLoading={!referralUrl || creatingReferralLink}
            onClick={handleReferralCopyLink}
            type="button"
            width="full"
            rightIcon={<Icon as={HiOutlineClipboard} ml={2} h={4} w={4} />}
          >
            <Text as="span" isTruncated>
              {referralUrl}
            </Text>
          </Button>
          <Flex as={Link} href="/referral" align="center">
            {t('user.referral.how')} <Icon as={BsArrowRight} ml={2} />
          </Flex>
        </Stack>
      )}
    </VStack>
  )
}

export default UserProfileInfo
