---
title: 'Customization'
---

# Customization

The starter kit has a few customizations out of the box to quickly customize based on your need. Of course, you can always customize even more by updating the different pages and components.

## Application

All metadata, like titles and descriptions, can be found directly in the head of all the pages in the `./pages` directory and in the `environment.ts` file under the `SEO Configuration` section.

The navigation can be updated in the `./pages/_app.tsx` or `./components/Navbar/Navbar.tsx`.

The logo and images can be found in the `./public` directory.

## Home page

You can showcase elements on the home page by editing the `.environment.ts` file. You can update the following fields:

- Featured NFTs
- Featured collections
- Featured users
- Custom section with featured elements

## Wallet

You can customize the wallet you want to activate for your marketplace directly in the `./connectors.ts` file. By default, the fork contains the following wallets:

- Metamask / injected wallet
- Coinbase
- WalletConnect
- [Magic.link](https://magic.link/) wallet
- [Rainbow](https://rainbow.me/) wallet

## Theme

The theme is based on [ChakraUI](https://chakra-ui.com/) and can be [customized](https://chakra-ui.com/docs/styled-system/customize-theme) in the `/styles/theme.ts` file.

## Multi-language

The starter kit supports multi-language navigation thanks to [next-translate](https://github.com/aralroca/next-translate).
You can activate the locales for your application in the `./i18n.js` file and edit your translations in the `./locales` directory.
