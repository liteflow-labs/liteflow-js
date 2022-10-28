import { Box, Center, Icon, Stack, Text } from '@chakra-ui/react'
import { FaImage } from '@react-icons/all-files/fa/FaImage'
import useTranslation from 'next-translate/useTranslation'
import Image, { ImageProps } from 'next/image'
import React, { useEffect, useState, VFC, VideoHTMLAttributes } from 'react'

const TokenMedia: VFC<
  (Omit<VideoHTMLAttributes<any>, 'src'> | Omit<ImageProps, 'src'>) & {
    image: string | null | undefined
    animationUrl: string | null | undefined
    unlockedContent: { url: string; mimetype: string | null } | null | undefined
    defaultText?: string
    controls?: boolean | undefined
    layout?: string | undefined
  }
> = ({
  image,
  animationUrl,
  unlockedContent,
  defaultText,
  layout,
  controls,
  ...props
}) => {
  // prioritize unlockedContent
  if (unlockedContent) {
    if (unlockedContent.mimetype?.startsWith('video/'))
      animationUrl = unlockedContent.url
    else image = unlockedContent.url
  }

  const [imageError, setImageError] = useState(false)
  const { t } = useTranslation('templates')

  // reset when image change. Needed when component is recycled
  useEffect(() => {
    setImageError(false)
  }, [image])

  if (animationUrl)
    return (
      <video
        src={animationUrl}
        autoPlay
        playsInline
        muted
        loop
        controls={controls}
        {...(props as Omit<VideoHTMLAttributes<any>, 'src'>)}
      />
    )
  if (image) {
    const rest = props as Omit<ImageProps, 'src'>
    if (imageError)
      return (
        <Center width="100%" height="100%" bg="brand.100">
          <Stack align="center" spacing={3}>
            <Icon as={FaImage} w="5em" h="4em" />
            <Text fontWeight="600">{t('asset.detail.errors.image')}</Text>
          </Stack>
        </Center>
      )
    const customTag = { Image: Image as any }
    return (
      <customTag.Image
        src={image}
        alt={defaultText}
        onError={() => setImageError(true)}
        layout={layout}
        {...rest}
      />
    )
  }
  return <Box bgColor="brand.50" h="full" w="full" />
}

export default TokenMedia
