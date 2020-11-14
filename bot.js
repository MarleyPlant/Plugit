const { MessageEmbed, Client } = require("discord.js");
const tableNames = require("./constants/tableNames");
const { Connection } = require("pg");
const knex = require("knex")(require("./knexfile").development);
const util = require("./util");
const updateServer = require("./helpers/updateServer");
const createServer = require("./helpers/createServer");
const getSettings = require("./helpers/getSettings");
const getGuild = require("./helpers/getGuild");
const doesCommandRequireParams = require("./helpers/doesCommandRequireParams");
const getProperUsageText = require("./helpers/getProperUsageText");
const client = new Client();
const pluginManager = new util.pluginManager();
require("dotenv").config();
let prefix;
let token;

function addHelpFieldToEmbed(embed, command) {
  embed.addField(
    prefix +
      pluginManager.commands[command].name +
      " " +
      pluginManager.commands[command].parameters.params,
    pluginManager.commands[command].help,
    true
  );
}

function addHelpFieldNoParams(embed, command) {
  embed.addField(
    prefix + pluginManager.commands[command].name,
    pluginManager.commands[command].help,
    true
  );
}

client.on("ready", () => {
  guilds = client.guilds.cache.array();

  console.log(`Logged in as ${client.user.tag}!`);
  console.log(
    `Connected to ${guilds.length} guilds, serving ${client.users.size} users.`
  );
  client.user.setActivity(process.env.playing);

  pluginManager.loadModules();
  pluginManager.listModules();

  //Handle events
  if (pluginManager.events["ready"]) {
    pluginManager.events["ready"].main(client, knex);
  }

  for (event in pluginManager.events) {
    if (event == "message") return;
    client.on(event, (arg1) => {
      pluginManager.events[event].main(client, knex, arg1);
    });
  }
});

//Help Command
pluginManager.addCommand({
  name: "help",
  help: "Display A List of commands And Their Features!",
  parameters: {
    params: "",
    required: false,
  },
  main: function (bot, knex, msg) {
    embed = new MessageEmbed().setTitle("Bot commands");
    for (command in pluginManager.commands) {
      if (pluginManager.commands[command].parameters) {
        addHelpFieldToEmbed(embed, command);
      } else {
        addHelpFieldNoParams(embed, command);
      }
    }
    msg.channel.send({ embed });
  },
});

client.on("guildCreate", async (guild) => {
  createServer(guild, knex);
});

client.on("guildUpdate", async (guild) => {
  getGuild((server) => {
    if (!server) {
      createServer(guild, knex);
    } else {
      updateServer(guild, knex);
    }
  });
});

//Handle commands
client.on("message", (msg) => {
  if (msg.author.bot) return; //If message is from a bot ignore.
  if (msg.content.indexOf(prefix) !== -1) {
    var parsed = util.args.parse(msg, prefix);
    var command = parsed.command;
    var args = parsed.args;

    if (command in pluginManager.commands) {
      if (process.env.delete_commands == true) msg.delete();
      if (doesCommandRequireParams(command, args, pluginManager)) {
        let reply = `You didn't provide any arguments, ${msg.author}!`;

        if (pluginManager.commands[command].parameters.params) {
          reply += getProperUsageText(prefix, command, pluginManager);
        }

        return msg.channel.send(reply);
      } else {
        pluginManager.commands[command].main(client, knex, msg);
      }
    }
  }

  if (pluginManager.events["message"]) {
    pluginManager.events["message"].main(client, knex, msg);
  }
});

getSettings(async (data) => {
  token = data["token"];
  prefix = data["prefix"];
  console.log("———————— Plugit! ————————");
  client.login(token);
});

module.exports = client;
