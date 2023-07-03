---
title: 'Get Started'
---

# Get started

## Step 1: Fork

To get started, you first need to [fork](https://github.com/liteflow-labs/starter-kit/fork) the [Starter Kit repository](https://github.com/liteflow-labs/starter-kit).

_More information on [what’s a fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) and [how to work with forks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks)._

## Step 2: Cloning your repository

[Clone](https://docs.github.com/en/get-started/quickstart/fork-a-repo#cloning-your-forked-repository) your repository to start to do some edits on your marketplace.

## Step 3: Install

Run the following command in your terminal:

```
npm install
```

This will install all the dependencies to run your marketplace.

## Step 4: Configure

To run your application, a few environmental variables need to be set.

Copy the `.env.example` to `.env`, then replace all the values according to your setup. You can find more details on the [configuration](./configuration) page.

For further customization, an optional option is to utilize the `environment.ts` file.

## Step 5: Run your marketplace

Everything is now ready to run your marketplace.

```
npm run dev
```

Your application is now accessible at http://localhost:3000.