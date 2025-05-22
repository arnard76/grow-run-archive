# Grow Run Archive

## Features

- Stores all of your grow runs
- Displays the cost of each grow run and cost per unit
- Shows how the cost is split among the resources that were used
- Stores conditions related to the grow e.g. temperature, pH

[Grow Run Archive - Demo 2024.webm](https://github.com/user-attachments/assets/2d152d34-d577-444d-9a20-97c15630539f)

## External Services

- Mailer : [Brevo](https://www.brevo.com/)
- Primary Database : [Firebase](https://firebase.google.com/?authuser=0)
- Secondary Database : [Neon PostgreSQL](https://neon.tech/about-us)
- Reverse Geocoding API : [Location IQ](https://locationiq.com/)

Follow these links and create an account for each service and add you credentials as environment variables.

For local development, create .env files with the format specified in [.env.example](./.env.example). There are several .env files that separate out the environment variables required for each application/microservice.

For deployment, add the environment variables to your host platform, [Vercel](https://vercel.com/docs/environment-variables) or [Render](https://render.com/docs/configure-environment-variables) for example. If environment variables are not found, try adding all variables in the .env files to the host platform.
