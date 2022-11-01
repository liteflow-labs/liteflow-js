const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  unstable_staticImage: true,
  unstable_flexsearch: {
    codeblocks: true,
  },
  unstable_defaultShowCopyCode: true,
})
module.exports = withNextra({
  reactStrictMode: true,
})
