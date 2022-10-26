import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
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
  useToast,
} from '@chakra-ui/react'
import { Signer } from '@ethersproject/abstract-signer'
import { BigNumber } from '@ethersproject/bignumber'
import {
  formatError,
  getHumanizedDate,
  parsePrice,
  useCreateAuction,
} from '@nft/hooks'
import useTranslation from 'next-translate/useTranslation'
import React, { useMemo, VFC } from 'react'
import { useForm } from 'react-hook-form'
import Image from '../../Image/Image'
import Select from '../../Select/Select'

type FormData = {
  endAt: string
  price: string
  startedAt: string
  currencyId: string
}

type Props = {
  signer: Signer | undefined
  assetId: string
  currencies: {
    name: string
    id: string
    image: string
    decimals: number
    symbol: string
  }[]
  auctionValidity: number
  onCreated: (id: string) => void
}

const SalesAuctionForm: VFC<Props> = ({
  signer,
  assetId,
  currencies,
  auctionValidity,
  onCreated,
}) => {
  const { t } = useTranslation('components')
  const [createAuction, { loading }] = useCreateAuction(signer)
  const toast = useToast()
  const {
    register,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      price: '0',
      currencyId: currencies[0].id,
    },
  })

  const price = watch('price')

  const currencyId = watch('currencyId')
  const currency = useMemo(() => {
    const c = currencies.find((x) => x.id === currencyId)
    if (!c) throw new Error("Can't find currency")
    return c
  }, [currencies, currencyId])
  const priceUnit = parsePrice(price, currency.decimals)

  // TODO: Add check for approval of maker token
  const onSubmit = handleSubmit(async (data) => {
    if (loading) return

    try {
      const auctionId = await createAuction({
        assetId,
        endAt: new Date(data.endAt),
        auctionValiditySeconds: auctionValidity,
        reserveAmount: (priceUnit || BigNumber.from(0)).toString(),
        currencyId: currency.id,
      })

      onCreated(auctionId)
    } catch (e) {
      toast({
        title: formatError(e),
        status: 'error',
      })
    }
  })

  return (
    <Stack as="form" spacing={8} onSubmit={onSubmit}>
      <Stack spacing={6}>
        {currencies.length > 1 && (
          <Select
            label={t('sales.auction.form.currency.label')}
            name="currencyId"
            hint={t('sales.auction.form.currency.hint')}
            control={control}
            placeholder={t('sales.auction.form.currency.placeholder')}
            choices={currencies.map((x) => ({
              value: x.id,
              label: x.symbol || '',
              image: x.image,
              caption: x.name,
            }))}
            value={currencyId}
            required
            error={errors.currencyId}
            onChange={(x: any) => setValue('currencyId', x)}
          />
        )}

        <FormControl>
          <HStack spacing={1}>
            <FormLabel htmlFor="price" m={0}>
              {t('sales.auction.form.price.label')}
            </FormLabel>
            <FormHelperText>({currency.symbol})</FormHelperText>
            <FormHelperText>
              {t('sales.auction.form.price.info')}
            </FormHelperText>
          </HStack>
          <FormHelperText mb={2}>
            {t('sales.auction.form.price.hint')}
          </FormHelperText>
          <InputGroup>
            <NumberInput
              clampValueOnBlur={false}
              min={0}
              step={Math.pow(10, -currency.decimals)}
              precision={currency.decimals}
              allowMouseWheel
              w="full"
              onChange={(x) => setValue('price', x)}
              format={(e) => e.toString()}
            >
              <NumberInputField
                id="price"
                placeholder={t('sales.auction.form.price.placeholder')}
                {...register('price')}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <InputRightElement
              mr={6}
              pointerEvents="none"
              children={
                <Image
                  src={currency.image}
                  alt={currency.symbol}
                  width={24}
                  height={24}
                />
              }
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel htmlFor="startedAt">
              {t('sales.auction.form.start.label')}
            </FormLabel>
            <Input
              placeholder={t('sales.auction.form.start.placeholder')}
              isDisabled
              {...register('startedAt')}
            />
          </FormControl>
        </GridItem>
        <GridItem colSpan={3}>
          <FormControl isInvalid={!!errors.endAt}>
            <FormLabel htmlFor="endAt">
              {t('sales.auction.form.end.label')}
            </FormLabel>
            <Input
              type="datetime-local"
              {...register('endAt', {
                required: t('sales.auction.form.validation.required'),
              })}
            />
            {errors.endAt && (
              <FormErrorMessage>{errors.endAt.message}</FormErrorMessage>
            )}
          </FormControl>
        </GridItem>
      </Grid>

      <Alert status="warning" borderRadius="xl">
        <AlertIcon />
        <Box fontSize="sm">
          <AlertTitle>{t('sales.auction.form.banner.title')}</AlertTitle>
          <AlertDescription
            as="ul"
            display="flex"
            flexWrap="wrap"
            listStyleType="disc"
            pl={6}
          >
            <li>{t('sales.auction.form.banner.item1')}</li>
            <li>
              {t('sales.auction.form.banner.item2', {
                validity: getHumanizedDate(auctionValidity),
              })}
            </li>
          </AlertDescription>
        </Box>
      </Alert>

      <Button isLoading={loading} size="lg" isFullWidth type="submit">
        <Text as="span" isTruncated>
          {t('sales.auction.form.submit')}
        </Text>
      </Button>
    </Stack>
  )
}

export default SalesAuctionForm
