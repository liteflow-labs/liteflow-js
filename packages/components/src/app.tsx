import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { ChakraProvider } from '@chakra-ui/react'
import { Dict } from '@chakra-ui/utils'
import React, { ComponentType, Fragment, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  theme: Dict
  bugsnagAPIKey?: string
}>

export default function LiteflowNFTApp({
  theme,
  bugsnagAPIKey,
  children,
}: Props): JSX.Element {
  if (bugsnagAPIKey) {
    Bugsnag.start({
      apiKey: bugsnagAPIKey,
      plugins: [new BugsnagPluginReact(React)],
    })
  }
  const ErrorBoundary = bugsnagAPIKey
    ? (Bugsnag.getPlugin('react')?.createErrorBoundary(React) as ComponentType)
    : Fragment

  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ErrorBoundary>
  )
}
