import Image from 'next/image'
import { useRouter } from 'next/router'
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs'

function Head(): JSX.Element {
  const { route } = useRouter()
  const { frontMatter } = useConfig()
  const description = frontMatter.description
  const title = frontMatter.title + (route === '/' ? '' : ' - Liteflow')

  return (
    <>
      {/* General */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <title>{title}</title>

      {/* SEO */}
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="og:title" content={title} />
      {/* <meta name="og:image" content="" /> */}
      {/* <meta name="twitter:card" content="summary_large_image" /> */}
      <meta name="apple-mobile-web-app-title" content="Liteflow" />
      <meta name="msapplication-TileColor" content="#02b14f" />
      <meta name="theme-color" content="#02b14f" />

      <link rel="icon" href="/favicon.png" />
    </>
  )
}

function Logo(): JSX.Element {
  return (
    <>
      <div style={{ marginRight: '10px' }}>
        <Image src="/logo.png" width={32} height={32} alt="Liteflow docs" />
      </div>
      <span>Liteflow docs</span>
    </>
  )
}

const config: DocsThemeConfig = {
  head: Head,
  primaryHue: 146,
  project: {
    link: 'https://github.com/liteflow-labs/liteflow-js',
  },
  docsRepositoryBase:
    'https://github.com/liteflow-labs/liteflow-js/blob/main/docs',
  logo: Logo,
  navigation: {
    prev: true,
    next: true,
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    text: `${new Date().getFullYear()} © Liteflow`,
  },
  toc: {
    float: true,
  },
}

export default config
