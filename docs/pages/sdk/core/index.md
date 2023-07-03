---
title: 'Introduction'
---

# Core SDK

This document provides a step-by-step guide on how to install and use the Liteflow Javascript SDK. The SDK allows you to access various modules such as Account, Asset, and Exchange.

## Installation

First, you need to install the `@liteflow/core` package along with its ethers peer dependency. You can do this using npm with the following command:

```bash
npm i @liteflow/core
```

## Creating a Client

After installation, you can create a client to access the different modules of the Liteflow SDK. To create a client, you will need an API key, which can be obtained from the Liteflow dashboard at https://dashboard.liteflow.com/developer/connection.

Here is a sample code snippet to create a client:

```ts
import { Client } from '@liteflow/core'

const client = new Client('API_KEY')
```

## User Authentication

To authenticate a user, you need to pass the `authorization` in the options while creating the client. Here's how you can do it:

```ts
new Client('API_KEY', { authorization: 'xxxx' })
```

## Using Modules

The `core` library is divided into different modules that you can use to perform various actions. Here are some of the modules:

- Account: Allows you to execute actions on an account.
- Asset: Lets you perform actions related to NFTs (also known as Assets).
- Exchange: Enables you to exchange NFTs and create various offers.

You can access these modules directly from the client using the following structure:

```bash
client.MODULE.ACTION
```

In the above structure, `MODULE` is the module you want to use, and `ACTION` is the action you want to execute.

For example, if you want to list a token in the exchange module, you can do it as follows:

```bash
client.exchange.listToken(...)
```

That's it! You are now ready to use the Liteflow Javascript SDK.
