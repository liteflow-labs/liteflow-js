import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer'
import { CreateNftStep, formatError, useCreateNFT } from '@nft/hooks'
import useTranslation from 'next-translate/useTranslation'
import React, { FC, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import Dropzone from '../../Dropzone/Dropzone'
import { Standard } from '../../graphql'
import CreateCollectibleModal from '../../Modal/CreateCollectible'
import LoginModal from '../../Modal/Login'
import Select from '../../Select/Select'

export type FormData = {
  name: string
  description: string
  royalties: string
  category: string
  amount: string
  content: File | undefined
  preview: File | undefined
  isPrivate: boolean
  isAnimation: boolean
}

type Props = {
  signer: (Signer & TypedDataSigner) | undefined
  multiple: boolean
  categories: { id: string; title: string }[]
  blockExplorer: BlockExplorer
  uploadUrl: string
  login: {
    email: boolean
    metamask: boolean
    coinbase: boolean
    walletConnect: boolean
    networkName: string
  }
  activateUnlockableContent: boolean
  maxRoyalties: number
  onCreated: (id: string) => void
  onInputChange: (data: Partial<FormData>) => void
  activateLazyMint: boolean
}

const TokenFormCreate: FC<Props> = ({
  signer,
  multiple,
  categories,
  blockExplorer,
  uploadUrl,
  login,
  activateUnlockableContent,
  maxRoyalties,
  onCreated,
  onInputChange,
  activateLazyMint,
}) => {
  const { t } = useTranslation('components')
  const toast = useToast()
  const {
    isOpen: loginIsOpen,
    onOpen: loginOnOpen,
    onClose: loginOnClose,
  } = useDisclosure()
  const {
    isOpen: createCollectibleIsOpen,
    onOpen: createCollectibleOnOpen,
    onClose: createCollectibleOnClose,
  } = useDisclosure()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      description: '',
      royalties: '0',
      isPrivate: false,
    },
  })
  const res = useWatch({ control })
  useEffect(() => onInputChange(res), [res, onInputChange])

  // const [transform] = useFileTransformer()
  const [createNFT, { activeStep, transactionHash }] = useCreateNFT(signer, {
    uploadUrl,
  })

  const handleFileDrop = (file: File) => {
    if (!file) return
    setValue('isAnimation', file.type.startsWith('video/'))
  }

  const onSubmit = handleSubmit(async (data) => {
    if (!data.content) throw new Error('content falsy')

    try {
      createCollectibleOnOpen()
      if (parseFloat(data.royalties) > maxRoyalties)
        throw new Error('Royalties too high')
      const assetId = await createNFT({
        standard: multiple ? Standard.Erc1155 : Standard.Erc721,
        name: data.name,
        description: data.description,
        content: data.content,
        preview: data.preview,
        isAnimation: data.isAnimation,
        isPrivate: data.isPrivate,
        amount: multiple ? parseInt(data.amount) : 1,
        royalties: parseFloat(data.royalties),
        traits: [{ type: 'Category', value: data.category }],
        isLazyMint: activateLazyMint,
      })

      onCreated(assetId)
    } catch (e) {
      toast({
        title: formatError(e),
        status: 'error',
      })
    } finally {
      createCollectibleOnClose()
    }
  })

  // TODO: activate this again when we want to reactivate the automatic blur with useFileTransformer()
  // useEffect(() => {
  //   if (!res.content) {
  //     setValue('preview', undefined)
  //     return
  //   }
  //   if (!res.isPrivate || res.isAnimation) return
  //   void transform(res.content).then((file) => {
  //     setValue('preview', file)
  //   })
  //   return () => {
  //     setValue('preview', undefined)
  //   }
  // }, [res.content, res.isAnimation, res.isPrivate, transform, setValue])

  return (
    <Stack
      align="flex-start"
      spacing={12}
      as="form"
      onSubmit={onSubmit}
      flex="1 1 0%"
    >
      <Dropzone
        label={t('token.form.create.file.label')}
        heading={t('token.form.create.file.heading')}
        hint={t('token.form.create.file.hint')}
        name="content"
        acceptTypes="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm"
        maxSize={100000000} // 100 MB
        required
        control={control}
        error={errors.content}
        onChange={(e) => handleFileDrop(e as unknown as File)}
        value={res.content as any}
      >
        {({ hasPreview }) =>
          hasPreview
            ? t('token.form.create.file.file.replace')
            : t('token.form.create.file.file.chose')
        }
      </Dropzone>
      {activateUnlockableContent && (
        <FormControl>
          <HStack spacing={1} mb={2}>
            <FormLabel m={0}>
              {t('token.form.create.unlockable.label')}
            </FormLabel>
            <FormHelperText>
              {t('token.form.create.unlockable.hint')}
            </FormHelperText>
          </HStack>
          <Checkbox onChange={() => setValue('isPrivate', !res.isPrivate)}>
            {t('token.form.create.unlockable.choice')}
          </Checkbox>
        </FormControl>
      )}
      {(res.isAnimation || res.isPrivate) && (
        <Dropzone
          label={t('token.form.create.preview.label')}
          heading={t('token.form.create.preview.heading')}
          hint={t('token.form.create.preview.hint')}
          name="preview"
          acceptTypes="image/jpeg,image/png,image/gif,image/webp"
          maxSize={100000000} // 100 MB
          required
          control={control}
          error={errors.preview}
          value={res.preview as any}
        >
          {({ hasPreview }) =>
            hasPreview
              ? t('token.form.create.preview.file.replace')
              : t('token.form.create.preview.file.chose')
          }
        </Dropzone>
      )}
      <FormControl isInvalid={!!errors.name}>
        <FormLabel htmlFor="name">
          {t('token.form.create.name.label')}
        </FormLabel>
        <Input
          id="name"
          placeholder={t('token.form.create.name.placeholder')}
          {...register('name', {
            required: t('token.form.create.validation.required'),
          })}
        />
        {errors.name && (
          <FormErrorMessage>{errors.name.message}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl>
        <HStack spacing={1} mb={2}>
          <FormLabel htmlFor="description" m={0}>
            {t('token.form.create.description.label')}
          </FormLabel>
          <FormHelperText>
            {t('token.form.create.description.info')}
          </FormHelperText>
        </HStack>
        <Textarea
          id="description"
          placeholder={t('token.form.create.description.placeholder')}
          {...register('description')}
          rows={5}
        />
      </FormControl>
      {multiple && (
        <FormControl isInvalid={!!errors.amount}>
          <FormLabel htmlFor="amount">
            {t('token.form.create.amount.label')}
          </FormLabel>
          <InputGroup>
            <NumberInput
              clampValueOnBlur={false}
              min={0}
              step={1}
              allowMouseWheel
              w="full"
              onChange={(x) => setValue('amount', x)}
              format={(e) => e.toString()}
            >
              <NumberInputField
                id="amount"
                placeholder={t('token.form.create.amount.placeholder')}
                {...register('amount', {
                  required: t('token.form.create.validation.required'),
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
          {errors.amount && (
            <FormErrorMessage>{errors.amount.message}</FormErrorMessage>
          )}
        </FormControl>
      )}
      <FormControl>
        <HStack spacing={1} mb={2}>
          <FormLabel htmlFor="royalties" m={0}>
            {t('token.form.create.royalties.label')}
          </FormLabel>
          <FormHelperText>
            {t('token.form.create.royalties.info')}
          </FormHelperText>
        </HStack>
        <InputGroup>
          <NumberInput
            clampValueOnBlur={false}
            min={0}
            max={maxRoyalties}
            step={0.01}
            allowMouseWheel
            w="full"
            onChange={(x) => setValue('royalties', x)}
            format={(e) => e.toString()}
          >
            <NumberInputField
              id="royalties"
              placeholder={t('token.form.create.royalties.placeholder')}
              {...register('royalties')}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <InputRightElement mr={6} pointerEvents="none" children="%" />
        </InputGroup>
      </FormControl>
      <Select
        label={t('token.form.create.category.label')}
        name="category"
        control={control}
        placeholder={t('token.form.create.category.placeholder')}
        choices={categories.map((x) => ({
          value: x.id,
          label: x.title,
        }))}
        value={res.category}
        required
        error={errors.category}
      />
      {signer ? (
        <Button isLoading={activeStep !== CreateNftStep.INITIAL} type="submit">
          <Text as="span" isTruncated>
            {t('token.form.create.submit')}
          </Text>
        </Button>
      ) : (
        <Button type="button" onClick={loginOnOpen}>
          <Text as="span" isTruncated>
            {t('token.form.create.submit')}
          </Text>
        </Button>
      )}
      <LoginModal isOpen={loginIsOpen} onClose={loginOnClose} {...login} />
      <CreateCollectibleModal
        isOpen={createCollectibleIsOpen}
        onClose={createCollectibleOnClose}
        title={t('token.form.create.title')}
        step={activeStep}
        blockExplorer={blockExplorer}
        transactionHash={transactionHash}
        isLazyMint={activateLazyMint}
      />
    </Stack>
  )
}

export default TokenFormCreate
