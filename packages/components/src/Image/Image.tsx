import { chakra } from '@chakra-ui/react'
import NextImage from 'next/image'

const Image = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    [
      'layout',
      'width',
      'height',
      'src',
      'alt',
      'quality',
      'placeholder',
      'blurDataURL',
      'loader ',
    ].includes(prop),
})

export default Image
