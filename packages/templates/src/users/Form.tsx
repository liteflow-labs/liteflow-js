import { useToast } from '@chakra-ui/react'
import { Account, UserFormEdit } from '@nft/components'
import { useSession } from '@nft/hooks'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, VFC } from 'react'
import { useGetAccountQuery } from '../graphql'
import useLoginRedirect from '../hooks/useLoginRedirect'

export const Template: VFC<{
  uploadUrl: string
}> = ({ uploadUrl }) => {
  const { t } = useTranslation('templates')
  const { push } = useRouter()
  const { account, signer } = useSession()
  useLoginRedirect()
  const toast = useToast()

  const { data } = useGetAccountQuery({
    variables: {
      address: account!,
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
