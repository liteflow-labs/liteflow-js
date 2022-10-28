import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import useTranslation from 'next-translate/useTranslation'
import numbro from 'numbro'
import React, {
  FC,
  InputHTMLAttributes,
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDropzone } from 'react-dropzone'
import { Control, FieldError, useController } from 'react-hook-form'

type IProps = InputHTMLAttributes<any> & {
  name: string
  label: string
  heading: string
  hint: string
  rounded?: boolean
  maxSize: number
  acceptTypes?: string
  withPlaceholder?: boolean
  value?: string | File
  control: Control<any, object>
  required?: boolean
  error?: FieldError | undefined
  labelInfo?: string | JSX.Element
  multiple?: boolean
  children: (context: { hasPreview: boolean }) => ReactNode
}

const Dropzone: FC<IProps> = ({
  name,
  label,
  heading,
  hint,
  rounded,
  maxSize,
  acceptTypes,
  withPlaceholder,
  value,
  control,
  required,
  error,
  labelInfo,
  multiple,
  onChange,
  children,
}) => {
  const { t } = useTranslation('components')
  const [file, setFile] = useState<File>()
  const preview = useMemo(() => {
    if (file) return new URL(URL.createObjectURL(file)).toString()
    if (typeof value !== 'string') return
    return value
  }, [value, file])

  useEffect(() => {
    if (!value) return setFile(undefined)
    if (typeof value === 'string') return setFile(undefined)
    setFile(value as File)
    return () => setFile(undefined)
  }, [value])

  const {
    field: { onChange: onChangeController },
  } = useController({
    control,
    name,
    rules: { required: required ? t('dropzone.required') : false },
    defaultValue: preview,
  })

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles[0]) return
      setFile(acceptedFiles[0])
      onChangeController(acceptedFiles[0])
      onChange && onChange(acceptedFiles[0])
    },
    [setFile, onChangeController, onChange],
  )

  const {
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({
    accept: acceptTypes || 'image/*',
    maxFiles: 1,
    maxSize,
    onDrop,
  })

  const dropzoneError = useMemo(
    () => fileRejections[0]?.errors[0],
    [fileRejections],
  )

  const emptyHandler = (e: SyntheticEvent) => e.preventDefault()

  const roundedDisplay = rounded ? 'full' : 'xl'

  return (
    <Stack as={FormControl} spacing={3} isInvalid={!!error}>
      {label && (
        <HStack spacing={1}>
          <FormLabel htmlFor={name} m={0}>
            {label}
          </FormLabel>
          {labelInfo && <FormHelperText>{labelInfo}</FormHelperText>}
        </HStack>
      )}
      <Stack
        pos="relative"
        cursor="pointer"
        align="center"
        justify="center"
        spacing={6}
        rounded="xl"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={
          isDragActive
            ? 'blue.600'
            : isDragReject || error || fileRejections.length > 0
            ? 'red.500'
            : 'inherit'
        }
        bgColor={
          isDragActive
            ? 'blue.100'
            : isDragReject || error || fileRejections.length > 0
            ? 'red.100'
            : 'transparent'
        }
        p={6}
        {...getRootProps()}
      >
        <Box
          m="auto"
          rounded={roundedDisplay}
          w={rounded ? 24 : 'full'}
          h={withPlaceholder ? 24 : 'full'}
          bgColor={
            preview ? 'transparent' : withPlaceholder ? 'gray.100' : undefined
          }
          visibility={
            file?.type.startsWith('video/') || (!file && !withPlaceholder)
              ? 'hidden'
              : undefined
          }
        >
          {preview && (
            <Box
              as="img"
              src={preview}
              alt={`${name} preview`}
              height="full"
              maxH={80}
              width="full"
              rounded={roundedDisplay}
              objectFit={withPlaceholder ? 'cover' : 'contain'}
            />
          )}
        </Box>
        <input {...getInputProps()} multiple={multiple || false} />

        {dropzoneError ? (
          <Heading
            as="span"
            variant="heading3"
            mb={3}
            w="full"
            textAlign="center"
            isTruncated
          >
            {dropzoneError.message}
            {dropzoneError.code === 'file-too-large' &&
              ` (${numbro(maxSize).format({
                output: 'byte',
                base: 'decimal',
                spaceSeparated: true,
              })})`}
          </Heading>
        ) : (
          <Heading
            as="span"
            variant="heading3"
            mb={3}
            w="full"
            textAlign="center"
            isTruncated
            maxW="280px"
          >
            {file?.name ? file.name : heading}
          </Heading>
        )}
        <Button variant="outline" onClick={emptyHandler}>
          <Text as="span" isTruncated>
            {children({ hasPreview: !!preview })}
          </Text>
        </Button>
        <Text as="p" variant="text-sm">
          {hint}
        </Text>
      </Stack>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </Stack>
  )
}

export default Dropzone
