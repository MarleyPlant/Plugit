[![Logo](https://i.imgur.com/ltCv7rbr.png)]()
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/MarleyPlant/Plugit)
[![Build Status](https://travis-ci.org/MarleyPlant/Plugit.svg?branch=master)](https://travis-ci.org/MarleyPlant/Plugit)
[![Discord Server](https://discordapp.com/api/guilds/367747780745232384/embed.png)](https://discord.gg/usefMdE)
[![dependencies Status](https://david-dm.org/marleyplant/Plugit/status.svg)](https://david-dm.org/marleyplant/Plugit)


Plugit is  a modular self hosted discord bot. In the future we plan to add easy intergration to Heroku as well as many more improvements and features.

### Tech

Plugit uses a number of open source projects to work properly:
* [node.js](https://nodejs.org/) - evented I/O for the backend
* [Express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node.
* [discord.js](https://discord.js.org/) - Discord API Wrapper For Node
* [Knex](https://github.com/tgriesser/knex) - A query builder for PostgreSQL, MySQL and SQLite3
* [BCryptJS](https://github.com/kelektiv/node.bcrypt.js) - bcrypt for NodeJs
* [Passport](https://github.com/jaredhanson/passport) - Simple, unobtrusive authentication for Node.js.
* [Gulp](https://github.com/gulpjs/gulp) - The streaming build system
* [Mocha](https://github.com/mochajs/mocha) - simple, flexible, fun javascript test framework for node.js & the browser

And of course Plugit itself is open source with a [public repository](https://github.com/MarleyPlant/Plugit) on GitHub.

### Config
Plugit uses a `.env` file to configure its core variables, in the repository you will find a `.env.example` file. you must rename this file to `.env` and then fill in the configuration variables.

| Variable | Function |
| ------ | ------ |
| Token | Your Discord Api Token |
| Prefix | Prefix Before all commands
| debug | true / false |
| delete_commands | true / false |
| shards | sharding mode |
| warnings | true / false |
| DATABASE_URL | Postgres Database URL |
| secret | Session Secret |

### Installation

Plugit requires [Node.js](https://nodejs.org/) and the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to run.

Install the dependencies and start the bot.

```sh
$ cd plugit
$ npm install --dev
$ mv .env.example .env
$ npm start
```

### Modules

Plugit is currently extendable using the following modules.

| Module | Repository |
| ------ | ------ |
| General | [modules/general.js](https://github.com/MarleyPlant/Plugit/blob/master/modules/general.js) |
| Overwatch | Coming Soon |
