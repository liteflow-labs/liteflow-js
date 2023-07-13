---
title: 'Introduction'
---

# Liteflow services

Liteflow enables customization of application behavior through the use of services, also known as micro-services. By utilizing directives from the application, Liteflow's infrastructure becomes highly flexible and powerful.

## Services in Liteflow

Liteflow communicates with the application through HTTPS requests with JSON payloads. The application responds with configurations for the specific actions.

## Configuring a Service

To start using a service in Liteflow, follow these simple steps:

1. Identify the desired service to respond to.
2. Create a public HTTPS URL as the endpoint for the service.
3. Parse incoming payloads and respond with the expected response with a 200 status code
4. Register the service URL in the Liteflow dashboard for use.
