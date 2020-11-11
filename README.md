![Plugit Logo](https://gitlab.com/plugitdev/plugit/-/raw/master/public/logo.png)
### Plugit Discord Bot 
This project is based on a GitLab [Project Template](https://docs.gitlab.com/ee/gitlab-basics/create-project.html).


We are using Discord.JS, Express, Postgres and Knex.JS to implement a discord bot that allows users to install plugins and custom commands.

- [x] Express Server Starts
- [ ] Postgres Server Starts (In Progress see: [docker-comppose](https://gitlab.com/plugitdev/plugit/-/tree/docker-compose))
- [x] User Can Login To Backend
- [ ] Discord.JS Bot Can Start/Stop
- [x] Discord.JS Bot Can Read Plugins.
- [x] Discord.JS Bot Can Accept Commands.
- [x] Users Can Easily Generator Modules

You can add the bot to your server [HERE](https://discord.com/oauth2/authorize?client_id=355715029296742403&scope=bot&permissions=8)

## Setup
Setting up the bot is easy. First of all clone the repo:
`git clone git@gitlab.com:MarleyPlant/Plugit`

Create `.env` file and inside add the following configuration options, you can find these on the [dicord developer portal](https://discord.com/developers/applications).
```
CLIENT_ID=''
CLIENT_SECRET=''
SESSION_SECRET=''
```

Starting the for the first time is as easy as:
`npm run build && npm start`

after this you must sign in on the web interface at [http://localhost:5000]().

## Creating Your Own Plugins.
For creating your own modules and plugins Plugit exposes certain classes to you as well as providing some utility functions.
To get started creating a module go to your modules folder in the plugit root.

```bash
npm install -g yeoman generator-plugit-module
yo plugit-module
```
This will create two folders called events and commands as well as an index file.

The index files will collect all the other files from the folder into one import.

The main index file will collect both the events and commands into a format that plugit can understand.

To create a custom command.

```bash
cd commands
mv exampleCommand.js (yourCommand Name)
```

then anywhere inside of the index.js file where its references to exampleCommand Change it to the name of your command.

Each command takes certain parameters so that plugit knows how to handle it properly.

the basic structure of a plugit module is


```js
module.exports = {
    name: 'example', //The Name of your command how it should be typed into the discord chat - the prefix.
    parameters: {
        params: [
            "(name)",
            "(role)",
        ],
        required: true, //Will the Main Function stil run if no arguments are supplied?
    },
    help: '', //Text that is shown under the command in the help command.
    main: function(bot, db, msg) //Should be a function that contains the bulk of your code. See below for examples.
}
```
Its pretty self explanatory.


The Main function is exposed 3 variables which can be referenced in the discord.js & and knex documents under [bot](https://discord.js.org/#/docs/main/stable/class/Client), [db](http://knexjs.org/#Builder), [msg](https://discord.js.org/#/docs/main/stable/class/Message)

## Database
The database will be using Postgres and Knex.JS.


Database Relationship ER Diagram can be found [Here](https://app.lucidchart.com/invitations/accept/af12fac3-fb13-435f-a70c-f407b0b7a554).


### CI/CD with Auto DevOps

This template is compatible with [Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/).

If Auto DevOps is not already enabled for this project, you can [turn it on](https://docs.gitlab.com/ee/topics/autodevops/#enabling-auto-devops) in the project settings.
