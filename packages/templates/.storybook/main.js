const path = require('path')

module.exports = {
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx|md)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chakra-ui/storybook-addon',
    'storybook-addon-apollo-client',
    'storybook-addon-next-router',
  ],
  webpackFinal: async (config) => {
    config.node = {
      fs: 'empty',
    }
    config.resolve.modules = [
      path.resolve(__dirname, '../../..'),
      'node_modules',
    ]
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    })
    return config
  },
  typescript: {
    check: true,
  },
}
