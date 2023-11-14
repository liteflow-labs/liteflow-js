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
    <svg
      height="64"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496.5 160.72"
    >
      <defs>
        <style jsx>{`
          .cls-1 {
            fill: #02b14f;
          }
          .cls-2 {
            fill: #ffffff;
          }
        `}</style>
      </defs>
      <g>
        <path
          fill="#02b14f"
          d="M129.99,34.07c-.73-2.44-1.92-4.7-3.62-6.28-24.82,24.85-49.79,49.86-74.49,74.6,8.45,0,18.97,0,25.35-.03,15.4-15.33,32.28-32.09,47.63-47.45,5.9-5.91,7.51-12.92,5.13-20.84Z"
        />
        <path
          fill="#02b14f"
          d="M128.39,114.11c-1.18-3.89-3.58-6.92-6.47-9.66-1.07-1.01-2.19-2.11-2.19-2.11,0,0,1.16-1.15,2.22-2.22,2.09-2.09,4.13-4.25,6.29-6.27,5.44-5.09,7.7-11.29,6.55-18.64-.55-3.53-2.04-6.68-4.29-9.11-12.3,12.29-24.44,24.42-36.4,36.37,9.9,9.93,20.04,20.1,30.24,30.34,4.56-5.34,6.03-12.12,4.04-18.72Z"
        />
        <path fill="#02b14f" d="M124.35,132.83c-.22,.3,.16-.14,0,0h0Z" />
      </g>
      <g>
        <path
          fill="currentColor"
          d="M169.89,102.54h18.36v8.9h-29.53V55.45h11.18v47.09Z"
        />
        <path
          fill="currentColor"
          d="M193.95,59.83c-1.3-1.26-1.96-2.82-1.96-4.69s.65-3.44,1.96-4.69c1.3-1.26,2.94-1.88,4.91-1.88s3.6,.63,4.91,1.88c1.3,1.26,1.96,2.82,1.96,4.69s-.65,3.44-1.96,4.69c-1.31,1.26-2.94,1.89-4.91,1.89s-3.61-.63-4.91-1.89Zm10.42,7.18v44.44h-11.18v-44.44h11.18Z"
        />
        <path
          fill="currentColor"
          d="M226.24,76.23v21.5c0,1.5,.36,2.58,1.08,3.25,.72,.67,1.93,1,3.63,1h5.19v9.46h-7.03c-9.42,0-14.13-4.6-14.13-13.8v-21.42h-5.27v-9.22h5.27v-10.99h11.25v10.99h9.9v9.22h-9.9Z"
        />
        <path
          fill="currentColor"
          d="M282.83,92.59h-32.33c.27,3.21,1.38,5.72,3.35,7.54,1.97,1.82,4.39,2.73,7.26,2.73,4.15,0,7.1-1.79,8.86-5.37h12.05c-1.28,4.28-3.72,7.79-7.34,10.55-3.62,2.75-8.06,4.13-13.33,4.13-4.26,0-8.08-.95-11.45-2.85-3.38-1.9-6.01-4.58-7.9-8.06-1.89-3.48-2.83-7.49-2.83-12.03s.93-8.64,2.79-12.11c1.86-3.48,4.47-6.15,7.82-8.02,3.35-1.87,7.21-2.81,11.57-2.81s7.97,.91,11.3,2.73c3.32,1.82,5.91,4.4,7.74,7.74,1.84,3.34,2.75,7.18,2.75,11.51,0,1.6-.11,3.05-.32,4.33Zm-11.25-7.54c-.05-2.89-1.09-5.2-3.11-6.94-2.02-1.74-4.5-2.61-7.42-2.61-2.77,0-5.1,.84-6.98,2.53-1.89,1.68-3.05,4.02-3.47,7.02h20.99Z"
        />
        <path
          fill="currentColor"
          d="M309.41,76.23h-7.74v35.21h-11.33v-35.21h-5.03v-9.22h5.03v-2.25c0-5.45,1.54-9.46,4.63-12.03,3.09-2.57,7.74-3.77,13.97-3.61v9.46c-2.71-.05-4.6,.4-5.67,1.36-1.07,.96-1.6,2.7-1.6,5.21v1.85h7.74v9.22Z"
        />
        <path fill="currentColor" d="M325.7,52.09v59.36h-11.18V52.09h11.18Z" />
        <path
          fill="currentColor"
          d="M342.7,109.32c-3.41-1.9-6.08-4.58-8.02-8.06-1.94-3.48-2.91-7.49-2.91-12.03s1-8.56,2.99-12.03c2-3.48,4.72-6.16,8.18-8.06,3.46-1.9,7.32-2.85,11.57-2.85s8.11,.95,11.58,2.85c3.46,1.9,6.19,4.59,8.18,8.06,2,3.48,2.99,7.49,2.99,12.03s-1.03,8.56-3.07,12.03c-2.05,3.48-4.82,6.16-8.3,8.06-3.49,1.9-7.38,2.85-11.69,2.85s-8.09-.95-11.49-2.85Zm17.2-8.42c1.78-.99,3.21-2.47,4.27-4.45,1.06-1.98,1.6-4.38,1.6-7.22,0-4.22-1.1-7.47-3.31-9.75-2.21-2.27-4.91-3.41-8.1-3.41s-5.87,1.14-8.02,3.41c-2.16,2.27-3.23,5.52-3.23,9.75s1.05,7.47,3.15,9.75c2.1,2.27,4.75,3.41,7.94,3.41,2.02,0,3.92-.49,5.71-1.48Z"
        />
        <path
          fill="currentColor"
          d="M444.63,67.01l-12.93,44.44h-12.05l-8.06-31.04-8.06,31.04h-12.13l-13.01-44.44h11.33l7.82,33.85,8.46-33.85h11.81l8.3,33.77,7.82-33.77h10.7Z"
        />
      </g>
    </svg>
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
