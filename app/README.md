## Deploy App

### Download Firebase Admin SDK Credentials

- [Download from here](https://console.firebase.google.com/u/0/project/grow-run-archive/settings/serviceaccounts/adminsdk)
- Save in [`src/lib/server/database`](src/lib/server/database/grow-run-archive-firebase-adminsdk-credentials.json) folder as `grow-run-archive-firebase-adminsdk-credentials.json`

### (LOCAL only) Generate Certs for HTTPS

- [Follow this method](https://stackoverflow.com/a/76525335)
- Store the certs (`cert.pem` & `key.pem`) in `./cert`
- now [Vite](./vite.config.ts) can locally deploy a server that supports https and SSL encryption.
