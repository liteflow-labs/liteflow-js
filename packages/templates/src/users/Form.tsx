import { Signer } from '@ethersproject/abstract-signer'
import { useToast } from '@chakra-ui/react'
import { Account, UserFormEdit } from '@nft/components'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, VFC } from 'react'
import { useGetAccountQuery } from '../graphql'
import useLoginRedirect from '../hooks/useLoginRedirect'
import { useWeb3React } from '@web3-react/core'

export const Template: VFC<{
  uploadUrl: string
  signer: Signer | undefined
  ready: boolean
}> = ({ uploadUrl, signer, ready }) => {
  const { t } = useTranslation('templates')
  const { push } = useRouter()
  const { account } = useWeb3React()
  useLoginRedirect(ready)

  const toast = useToast()

  const { data } = useGetAccountQuery({
    variables: {
      address: account || '',
    },
    skip: !account,
  })

  const onSubmit = useCallback(
    async (address: string) => {
      toast({
        title: t('users.form.notifications.updated'),
        status: 'success',
      })
      await push(`/users/${address}`)
    },
    [toast, t, push],
  )

  if (!data?.account) return <></>
  return (
    <Account currentTab="edit-profile">
      <UserFormEdit
        signer={signer}
        onUpdated={onSubmit}
        uploadUrl={uploadUrl}
        account={data.account}
      />
    </Account>
  )
}
