import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import {
  Alert,
  AlertIcon,
  Center,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { BackButton, Link, TokenCard, TokenFormCreate } from '@nft/components'
import type { Props as NFTCardProps } from '@nft/components/dist/Token/Card'
import type { FormData } from '@nft/components/dist/Token/Form/Create'
import { useConfig } from '@nft/hooks'
import { HiBadgeCheck } from '@react-icons/all-files/hi/HiBadgeCheck'
import { useEffect } from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Trans from 'next-translate/Trans'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import {
  Config,
  FetchAccountDocument,
  FetchAccountQuery,
  useFetchAccountQuery,
} from '../graphql'
import useBlockExplorer from '../hooks/useBlockExplorer'
import useLocalFileURL from '../hooks/useLocalFileURL'
import { wrapServerSideProps } from '../props'
import { useWeb3React } from '@web3-react/core'

export type Props = {
  multiple: boolean
  traits: { [key: string]: string[] }
  currentAccount: string | null
}

export const server = (
  url: string,
  traits: { [key: string]: string[] },
): GetServerSideProps<Props> =>
  wrapServerSideProps<Props>(url, async (context, client) => {
    const { data, error } = await client.query<FetchAccountQuery>({
      query: FetchAccountDocument,
      variables: {
        account: context.user.address || '',
      },
    })
    if (error) throw error
    if (!data) throw new Error('data is falsy')
    return {
      props: {
        multiple: context.query.type === 'multiple',
        traits,
        currentAccount: context.user.address,
      },
    }
  })

export const Template: NextPage<
  Props & {
    explorer: {
      name: string
      url: string
    }
    uploadUrl: string
    login: {
      email: EmailConnector
      injected: InjectedConnector
      walletConnect: WalletConnectConnector
      coinbase: WalletLinkConnector
      networkName: string
    }
    maxRoyalties?: number
    restrictMintToVerifiedAccount?: boolean
    reportEmail?: string
    ready: boolean
    signer: (Signer & TypedDataSigner) | undefined
  }
> = ({
  multiple,
  explorer,
  uploadUrl,
  login,
  traits,
  currentAccount,
  maxRoyalties = 30,
  restrictMintToVerifiedAccount = false,
  reportEmail,
  ready,
  signer,
}) => {
  const { t } = useTranslation('templates')
  const { back, push } = useRouter()
  const { account } = useWeb3React()
  const configPromise = useConfig()
  const [config, setConfig] = useState<Config>()
  const toast = useToast()
  const { data } = useFetchAccountQuery({
    variables: {
      account: (ready ? account?.toLowerCase() : currentAccount) || '',
    },
  })

  const [formData, setFormData] = useState<Partial<FormData>>()

  const blockExplorer = useBlockExplorer(explorer.name, explorer.url)
  const imageUrlLocal = useLocalFileURL(
    formData?.isPrivate || formData?.isAnimation
      ? formData?.preview
      : formData?.content,
  )
  const animationUrlLocal = useLocalFileURL(
    formData?.isAnimation && !formData.isPrivate ? formData.content : undefined,
  )

  const asset: NFTCardProps['asset'] = useMemo(
    () =>
      ({
        id: '',
        image: imageUrlLocal || undefined,
        animationUrl: animationUrlLocal,
        name: formData?.name || '',
        standard: multiple ? 'ERC1155' : 'ERC721',
      } as NFTCardProps['asset']),
    [imageUrlLocal, animationUrlLocal, formData?.name, multiple],
  )

  const creator = useMemo(
    () => ({
      address: data?.account?.address || '0x',
      image: data?.account?.image || undefined,
      name: data?.account?.name || undefined,
      verified: data?.account?.verification?.status === 'VALIDATED',
    }),
    [data?.account],
  )

  const categories = useMemo(
    () =>
      (traits['Category'] || []).map((x) => ({
        id: x,
        title: t(`categories.${x}`, null, { fallback: x }),
      })) || [],
    [t, traits],
  )

  const onCreated = useCallback(
    async (assetId: string) => {
      toast({
        title: t('asset.form.notifications.created'),
        status: 'success',
      })
      await push(`/tokens/${assetId}`)
    },
    [push, t, toast],
  )

  useEffect(() => {
    void configPromise.then(setConfig)
    return () => setConfig(undefined)
  }, [configPromise])

  if (restrictMintToVerifiedAccount && !creator.verified) {
    return (
      <>
        <BackButton onClick={back} />
        <Heading as="h1" variant="title" color="brand.black" mt={6} mb={12}>
          {t('asset.typeSelector.title')}
        </Heading>
        <Stack align="center" spacing={6} mb={40}>
          <Center bgColor="brand.50" w={12} h={12} rounded="full">
            <Icon as={HiBadgeCheck} color="brand.500" w={6} h={6} />
          </Center>
          <Stack textAlign="center">
            <Heading variant="heading1">{t('asset.restricted.title')}</Heading>
            <Text pb={2} color="gray.500">
              <Trans
                ns="templates"
                i18nKey="asset.restricted.description"
                components={[
                  <Link fontWeight="bold" href={`mailto:${reportEmail}`}>
                    {reportEmail}
                  </Link>,
                ]}
              />
            </Text>
          </Stack>
          <Alert
            status="info"
            rounded="xl"
            borderWidth="1px"
            borderColor="blue.300"
          >
            <AlertIcon />
            <Text variant="subtitle2">{t('asset.restricted.info')}</Text>
          </Alert>
        </Stack>
      </>
    )
  }

  return (
    <>
      <BackButton onClick={back} />
      <Heading as="h1" variant="title" color="brand.black" mt={6}>
        {multiple
          ? t('asset.form.title.multiple')
          : t('asset.form.title.single')}
      </Heading>

      <Flex
        mt={12}
        w="full"
        gap={6}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'center', md: 'flex-start' }}
      >
        <div>
          <Flex as={Text} color="brand.black" mb={3} variant="button1">
            {t('asset.form.preview')}
          </Flex>
          <TokenCard
            asset={asset}
            creator={creator}
            auction={undefined}
            sale={undefined}
            numberOfSales={0}
            hasMultiCurrency={false}
          />
        </div>
        <TokenFormCreate
          signer={signer}
          multiple={multiple}
          categories={categories}
          uploadUrl={uploadUrl}
          blockExplorer={blockExplorer}
          onCreated={onCreated}
          onInputChange={setFormData}
          login={login}
          activateUnlockableContent={config?.hasUnlockableContent || false}
          maxRoyalties={maxRoyalties}
          activateLazyMint={config?.hasLazyMint || false}
        />
      </Flex>
    </>
  )
}
