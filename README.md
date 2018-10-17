![MVP Workshop](https://img.shields.io/badge/MVP_Workshop-Born_and_bred-purple.svg?style=for-the-badge)

# TypeScript HTTP Framework

![](https://i.imgur.com/DAZKpgY.gif)
> badoom-ts!

## Getting started

1. Install dependencies:
`yarn install`

2. Setup `tsconfig.json`

3. Run `docker-compose up -d`

4. Start the watchers: `yarn start`

## How to

- Run db migrations: `yarn db:migration:migrate`
- Create new migration: `yarn db:migration:generate --name create-users-table`

## Publishing New Version

#### Transformer Changes

The transformer is used in other `tsconfig.json` files for compiling Typescript projects. In order for this to work the transformer file is distributed as a compiled .js file. 

Before publishing a new version which contains changes in the transformer be sure to run the following command and commit any changes.

```
yarn build:transformer
```
