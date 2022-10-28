import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { HiChevronDown } from '@react-icons/all-files/hi/HiChevronDown'
import React, { FC, HTMLAttributes, useMemo } from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'
import Image from '../Image/Image'

type IProps = HTMLAttributes<any> & {
  selectWidth?: string | number
  dropdownMaxHeight?: string | number
  label?: string
  choices: {
    value: string
    label: string
    image?: string
    caption?: string
  }[]
  value?: string
  onChange?(value: string | string[] | undefined): void
  disabled?: boolean
  error?: FieldError | undefined
  name: string
  hint?: string
  required?: boolean
  control?: Control<any, object>
  labelInfo?: string | JSX.Element
  inlineLabel?: boolean
}

const Select: FC<IProps> = ({
  selectWidth,
  dropdownMaxHeight,
  label,
  choices,
  value,
  placeholder,
  error,
  onChange,
  name,
  hint,
  required,
  control,
  labelInfo,
  inlineLabel,
  ...props
}) => {
  const selectedChoice = useMemo(
    () => choices.find((x) => x.value === value),
    [choices, value],
  )

  const select = (hookChange?: (...event: any[]) => void) => (
    <FormControl isInvalid={!!error}>
      <Flex
        position="relative"
        direction={{
          base: 'column',
          sm: inlineLabel ? 'row' : 'column',
        }}
        gap={label && !hint ? 3 : undefined}
        {...props}
      >
        {label && (
          <HStack spacing={1} minWidth={inlineLabel ? 'max' : 'initial'}>
            <FormLabel htmlFor={name} m={0}>
              {label}
            </FormLabel>
            {labelInfo && <FormHelperText>{labelInfo}</FormHelperText>}
          </HStack>
        )}
        {hint && (
          <Text as="p" variant="text-sm" color="gray.500" mt={1} mb={3}>
            {hint}
          </Text>
        )}
        <Box position="relative" flex="1 1 0%">
          <Menu matchWidth>
            <MenuButton
              as={Button}
              variant="select"
              position="relative"
              rounded="xl"
              px={4}
              py={2}
              borderWidth="1px"
              color={
                props.disabled ? 'gray.500' : !error ? 'brand.black' : 'red.900'
              }
              bgColor={props.disabled ? 'gray.100' : 'white'}
              w={selectWidth ? selectWidth : 'full'}
              shadow={props.disabled ? undefined : 'sm'}
              pointerEvents={props.disabled ? 'none' : undefined}
              borderColor={!error ? 'gray.200' : 'red.300'}
              _hover={{
                shadow: props.disabled ? undefined : 'md',
              }}
              _focus={{
                ring: 1,
                ringColor: !error ? 'brand.500' : 'red.500',
                borderColor: !error ? 'brand.500' : 'red.500',
                outline: 'none',
              }}
              rightIcon={<Icon w={5} h={5} as={HiChevronDown} />}
            >
              <Flex align="center" gap={2}>
                {selectedChoice ? (
                  <>
                    {selectedChoice.image && (
                      <Box
                        h={6}
                        w={6}
                        overflow="hidden"
                        rounded="full"
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Image
                          src={selectedChoice.image}
                          width={24}
                          height={24}
                        />
                      </Box>
                    )}
                    <Text as="span" isTruncated fontWeight="normal">
                      {selectedChoice.label}
                    </Text>
                  </>
                ) : (
                  <Text
                    as="span"
                    fontWeight="normal"
                    isTruncated
                    color="gray.500"
                  >
                    {placeholder}
                  </Text>
                )}
              </Flex>
            </MenuButton>
            <MenuList
              zIndex={10}
              minW={0}
              maxH={dropdownMaxHeight ? dropdownMaxHeight : 52}
              overflowY="scroll"
            >
              {choices.map((choice, i) => (
                <MenuItem
                  onClick={() => {
                    if (Array.isArray(choice.value))
                      throw new Error(
                        'not compatible with selection of multiple value',
                      )
                    hookChange && hookChange(choice.value)
                    onChange && onChange(choice.value)
                  }}
                  key={i}
                >
                  <Flex align="center" gap={2}>
                    {choice.image && (
                      <Box
                        h={6}
                        w={6}
                        overflow="hidden"
                        rounded="full"
                        borderWidth="1px"
                        borderColor="gray.200"
                      >
                        <Image src={choice.image} width={24} height={24} />
                      </Box>
                    )}
                    <Text
                      as="span"
                      fontSize="sm"
                      fontWeight={
                        selectedChoice?.value === choice.value
                          ? 'semibold'
                          : 'normal'
                      }
                    >
                      {choice.label}
                    </Text>
                    {choice.caption && (
                      <Text as="span" variant="text-sm" color="gray.500">
                        {choice.caption}
                      </Text>
                    )}
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  )

  return control ? (
    <Controller
      control={control}
      name={name}
      rules={{ required: required ? 'This field is required.' : false }}
      render={({ field: { onChange: hookChange } }) => select(hookChange)}
    />
  ) : (
    select()
  )
}

export default Select
