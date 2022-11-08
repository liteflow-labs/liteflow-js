import { Button, Icon, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { formatError, useInvitation, useSigner } from '@nft/hooks'
import { HiOutlineClipboard } from '@react-icons/all-files/hi/HiOutlineClipboard'
import { useWeb3React } from '@web3-react/core'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useEffect, useMemo, useState, VFC } from 'react'
import LoginModal from '../Modal/Login'

type Props = {
  loginUrl: string
  login: {
    email: boolean
    metamask: boolean
    coinbase: boolean
    walletConnect: boolean
    networkName: string
  }
}

const ReferralForm: VFC<Props> = ({ login, loginUrl }) => {
  const { t } = useTranslation('components')
  const toast = useToast()
  const { account } = useWeb3React()
  const signer = useSigner()
  const { create, creating } = useInvitation(signer)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [url, setUrl] = useState<string>()

  useEffect(() => {
    if (!account) return // make sure the user is fully logged in
    if (url) return
    create()
      .then((id) => setUrl(`${loginUrl}?ref=${id}`))
      .catch((error) =>
        toast({
          title: formatError(error),
          status: 'error',
        }),
      )
  }, [url, create, loginUrl, toast, account])

  const handleClick = useCallback(() => {
    if (!url) return
    void navigator.clipboard.writeText(url)
    toast({
      title: t('referral.form.copy'),
      status: 'success',
    })
  }, [url, t, toast])

  const action = useMemo(() => {
    if (!account)
      return (
        <>
          <LoginModal isOpen={isOpen} onClose={onClose} {...login} />
          <Button onClick={onOpen} width="full">
            <Text as="span" isTruncated>
              {t('referral.form.connect')}
            </Text>
          </Button>
        </>
      )
    return (
      <Button
        variant="outline"
        isLoading={!url || creating}
        onClick={handleClick}
        type="button"
        width="full"
        rightIcon={<Icon as={HiOutlineClipboard} h={4} w={4} ml={2} />}
      >
        <Text as="span" isTruncated>
          {url}
        </Text>
      </Button>
    )
  }, [account, handleClick, login, t, creating, url, isOpen, onClose, onOpen])

  return action
}

export default ReferralForm
