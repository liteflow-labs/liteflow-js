import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'

type IProps = LinkProps & {
  href: string
}

const Link = (props: IProps): JSX.Element => {
  const { children, href, isExternal, ...rest } = props
  if (isExternal) {
    return (
      <ChakraLink href={href} isExternal {...rest}>
        {children}
      </ChakraLink>
    )
  }
  return (
    <NextLink passHref href={href}>
      <ChakraLink {...rest}>{children}</ChakraLink>
    </NextLink>
  )
}

export default Link
