# Installation

- Requires npm 7+

```bash
npm i
```

# Development

## Lint

```bash
# check for errors
npm run lint

# fix the errors
npm run lint:fix
```

## Storybook

```bash
npm run storybook -w packages/components
```

## Generate GraphQL types

To generate the types for all the packages:

```bash
npm run graphql-codegen
```

## Packages

To build all the @nft packages in the right order:

```bash
npm run build
```

To build the packages in watch mode:

```bash
npm run watch
```

## Clean

If you get some build issue, try to clean your local builds output by running:

```bash
npm run clean
```

# Publish

The CI is building and publishing at every merge to the main branch the packages, the docker images and a git tag.
