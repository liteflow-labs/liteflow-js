---
title: 'Introduction'
---

# Liteflow webhooks

Liteflow uses webhooks to notify your application in real-time when an event occurs in your backend. These events can range from a new offer created to a trade executed or an offer expired.

## How Liteflow uses webhooks

Liteflow sends event notifications to your app via HTTPS as a JSON payload, enabling your app to receive real-time updates. You can use these notifications to trigger actions in your backend systems.

## Steps to receive webhooks

To start receiving event notifications, follow these steps:

1. Determine the events you want to monitor and the event payloads to parse.
2. Create a publicly accessible HTTPS URL as your webhook endpoint.
3. Parse the event from the body and respond with a 200 status code.
4. Register your webhook URL in the Liteflow dashboard.
