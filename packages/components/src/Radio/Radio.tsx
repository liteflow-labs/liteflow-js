import { Box, Flex, RadioProps, Text, useRadio } from '@chakra-ui/react'
import React, { FC } from 'react'

type IProps<T = string> = RadioProps & {
  choice: {
    value: T
    label: string
    icon?: any
    disabled?: boolean
  }
}

const Radio: FC<IProps> = ({ choice, ...props }) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  return (
    <Box
      as="label"
      pointerEvents={choice.disabled ? 'none' : undefined}
      w={{
        base: 'full',
        sm: 'auto',
      }}
      _focus={{
        borderWidth: '1px',
        borderColor: 'inherit',
        ringColor: 'brand.500',
        ringOpacity: '1',
        outline: 'none',
      }}
    >
      <input {...getInputProps()} hidden />
      <Flex
        cursor={choice.disabled ? 'not-allowed' : 'pointer'}
        align="center"
        gap={4}
        rounded="xl"
        borderWidth="2px"
        borderColor={
          choice.disabled
            ? 'transparent'
            : props.isChecked
            ? 'brand.500'
            : 'inherit'
        }
        py={7}
        pl={5}
        pr={4}
        transition="all 0.3s ease-in-out"
        shadow={props.isChecked ? 'md' : 'sm'}
        {...getCheckboxProps()}
      >
        {choice.icon && (
          <Box as={choice.icon} h={6} w={6} transition="all 0.3s ease-in-out" />
        )}
        <Text
          variant="button1"
          cursor={choice.disabled ? 'not-allowed' : 'pointer'}
        >
          {choice.label}
        </Text>
      </Flex>
    </Box>
  )
}

export default Radio
