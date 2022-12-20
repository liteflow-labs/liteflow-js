const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  staticImage: true,
  flexsearch: {
    codeblocks: true,
  },
  defaultShowCopyCode: true,
})
module.exports = withNextra({
  reactStrictMode: true,
})
