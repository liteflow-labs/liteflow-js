import { MockedProvider } from '@apollo/client/testing' // Use for Apollo Version 3+
import { extendTheme } from '@chakra-ui/react'
import LiteflowNFTApp, { baseTheme } from '@nft/components'
import components from '@nft/components/locales/en/components.json'
import { EmailConnector } from '@nft/email-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import I18nProvider from 'next-translate/I18nProvider'
import { RouterContext } from 'next/dist/shared/lib/router-context' // next 11.1
import * as NextImage from 'next/image'
import templates from '../locales/en/templates'

NextImage.defaultProps = {
  unoptimized: true,
}

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: {
    MockedProvider,
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  chakra: {
    theme: extendTheme({ ...baseTheme }),
  },
}

const withThemeProvider = (Story, context) => {
  return (
    <I18nProvider lang="en" namespaces={{ templates, components }}>
      <LiteflowNFTApp
        ssr={false}
        theme={parameters.chakra.theme}
        endpointUri="" // TODO: replace with testing endpoint if needed
        connectors={{
          email: new EmailConnector({
            options: {
              network: {},
            },
          }),
          injected: new InjectedConnector({}),
          walletConnect: new WalletConnectConnector({}),
          coinbase: new WalletLinkConnector({}),
        }}
        cache={{}}
      >
        <Story {...context} />
      </LiteflowNFTApp>
    </I18nProvider>
  )
}

export const decorators = [withThemeProvider]