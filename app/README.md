# Grow Run Archive Web Application

## Deploy Setup

### (LOCAL only) Generate Certs for HTTPS

- [Follow this method](https://stackoverflow.com/a/76525335)
- Store the certs (`cert.pem` & `key.pem`) in `./cert`
- now [Vite](./vite.config.ts) can locally deploy a server that supports https and SSL encryption.
