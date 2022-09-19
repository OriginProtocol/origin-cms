# Origin Protocol Headless CMS

This uses Strapi to manage the admin interface and API used for [originprotocol.com](https://originprotocol.com), [ousd.com](https://ousd.com), and [story.xyz](https://story.xyz). It is built with [Strapi](https://strapi.io/).

## Install
```
yarn install
cp .env.example .env

```

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```
yarn develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```
yarn start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```
yarn build
```

### Adding/editing collection types
Strapi uses filesystem JSON files to record its configurable data types. We're using Heroku to provision our Strapi, with plans tomove to AWS, which means any changes to data types on the production version of Strapi aren't persistent. So, to make collection type changes, we need to create/edit data types locally, commit them through git, and then deploy them.