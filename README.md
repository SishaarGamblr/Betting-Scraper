# Betting-Scraper <!-- omit from toc -->

![image](https://user-images.githubusercontent.com/20084278/209895111-6ef836f6-282c-40dd-83b5-39ed31c34d7d.png)

- [Getting Started](#getting-started)
- [Running tasks](#running-tasks)
- [Working with the database](#working-with-the-database)
- [Developing in this service](#developing-in-this-service)

This service is in charge of fetching betting lines and exposing them via an API

This service defines a task called `fetch-lines` that scrapes betting lines from different websites. Currently the only website we scrape is Draftkings.

## Getting Started
Install [nodenv](https://github.com/nodenv/nodenv)

Using nodenv, install this repository's version of node

```
nodenv install
```

Install dependencies

```
npm install
```

Start the container. This will start the API server, and should set up the database as well

```
npm run docker:dev
```

You can now open a separate window and connect to the container via

```
npm run docker:connect
```

You may need to run migrations on the database

```
npm run db:migrate
```

To compile the project run
```
npm run build
```

## Running tasks 
In order to run the `fetch-lines` task you can choose to run either the typescript task or the compiled pure javascript task

Running the typescript task is recommended if you are developing and modifying the task. You can do so via

```
npx ts-node src/tasks/fetch-lines.ts
```

Running the pure javascript task is recommended when testing the production version of the task, and typically has better performance

```
node dist/tasks/fetch-lines.js
```

## Working with the database
The docker image should typically set up the database. If the database is not being set up, you may need to manually set it up via

```
npm run db:setup
npm run db:setup:user
```

In order to create a migration, run

```
npm run db:migrate:make {NAME OF YOUR MIGRATION}
```

In order to run all outstanding migrations, run

```
npm run db:migrate
```

In order to rollback a migration, run

```
npm run db:rollback
```

In order to reset the database, run

```
npm run db:reset
```

## Developing in this service

The docker image typically starts a server. This may not be preferable, and can be disabled by uncommenting the following line in the docker-compose file

```
# command: tail -f /dev/null
```

You can then open a separate terminal window and connect to the container via

```
npm run docker:connect
```

You can then start your own development server (uses `ts-node`) via
the following. Note that the development server has hot reload enabled.
```
npm run start:dev
```

You can start your own production server via

```
npm run start
```

In order to format your code before merging, run
```
npm run format
```
