---
title: 'Configuration'
layout: 'full'
---

# Configuration

To run your application, a few environmental variables need to be set.
All other configurations can be done from the [dashboard](/tools/dashboard) in the [setting page](https://dashboard.liteflow.com/settings).

## Required Environmental variables

| Variable                              | Description                                                                                   | Value example                |
| ------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------- |
| NEXT_PUBLIC_LITEFLOW_API_KEY          | API key for the Liteflow infrastructure (https://dashboard.liteflow.com/developer/connection) | xxxxxx                       |
| NEXT_PUBLIC_BASE_URL                  | Base URL for your platform                                                                    | https://marketplace.acme.com |
| NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID | Wallet connect API key                                                                        | xxxxxx                       |

## Optional Environmental variables

| Variable                      | Description                                                      | Value example                      |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------- |
| NEXT_PUBLIC_ALCHEMY_API_KEY   | Alchemy API key if you want to use Alchemy for your blockchain   | xxxxxx                             |
| NEXT_PUBLIC_MAGIC_API_KEY     | Magic.link API key if the email wallet is activated              | pk_live_XXX                        |
| EMAIL_HOST                    | Host configuration for your email provider                       | smtp.sendgrid.net                  |
| EMAIL_PORT                    | Port configuration for your email provider                       | 587                                |
| EMAIL_USERNAME                | Username configuration for your email provider                   | apikey                             |
| EMAIL_PASSWORD                | Password configuration for your email provider                   | SG.xxx                             |
| EMAIL_FROM                    | Email from configuration for your email provider                 | Liteflow \<contact\@liteflow.com\> |
| LITEFLOW_WEBHOOK_SECRET       | Webhook secret to receive event from the Liteflow infrastructure | xxxxxx                             |
| NEXT_PUBLIC_BUGSNAG_API_KEY   | Key for Bugsnag to track errors                                  | xxxxxx                             |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | Google analytics ID                                              | G-XXX                              |

[View the env example file](https://github.com/liteflow-labs/starter-kit/blob/main/.env.example)
