import { Link as ChakraLink, LinkProps } from '@chakra-ui/react'
import NextLink from 'next/link'
import React from 'react'
import { forwardRef } from 'react'

type IProps = LinkProps & {
  href: string
}

const Link = forwardRef<any, IProps>((props, ref) => {
  const { children, href, isExternal, ...rest } = props
  if (isExternal) {
    return (
      <ChakraLink ref={ref} href={href} isExternal {...rest}>
        {children}
      </ChakraLink>
    )
  }
  return (
    <NextLink ref={ref} passHref href={href}>
      <ChakraLink ref={ref} {...rest}>
        {children}
      </ChakraLink>
    </NextLink>
  )
})

export default Link
