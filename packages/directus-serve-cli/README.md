# Directus Serve CLI

Manage directus files to serve them with directus-extension-serve.

## API

To check the complete CLI API goto [API](./docs/API.md).

### Config

All properties can be passed via a config file. We use [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to fetch different config files:

```shell
By default, Cosmiconfig will check the current directory for the following:

- a package.json property
- a JSON or YAML, extensionless "rc file"
- an "rc file" with the extensions `.json`, `.yaml`, `.yml`, `.js`, `.ts`, `.mjs`, or `.cjs`
- any of the above two inside a `.config` subdirectory
```

## Commands

### Upload

Upload files to a Directus instance:

```bash
npx directus-serve-cli upload --directusUrl http://localhost:8055 --src ./dist --uploadFolder <your-folder-id> --directusToken <your-access-token>
```

> **NOTE:** You can provide the `directusToken` as well via `.env` file or env variable as `DIRECTUS_ACCESS_TOKEN`. This is helpful for CI/CD environments.

All cli options can be passed via a config file. For more details, check out the [API](./docs/API.md).
Here is an example of a config file:

```js
/* .config/custom-upload-config.js */
{
  "directusUrl": "http://localhost:8055",
  "src": "./dist",
  "uploadFolder": "<your-folder-id>"
}
```

```bash
npx directus-serve-cli upload --config .config/custom-upload-config.js
```

#### Create directusToken

TODO: Add instructions on how to create a directusToken.