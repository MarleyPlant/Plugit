require("dotenv").config();
const { MessageEmbed, Client } = require("discord.js");
const tableNames = require("./constants/tableNames");
const { Connection } = require("pg");
const knex = require("knex")(require("./knexfile").development);
const util = require("./util");
const updateServer = require("./helpers/updateServer");
const createServer = require("./helpers/createServer");
const client = new Client();
const pluginManager = new util.pluginManager();

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
        embed.addField(
          process.env.prefix +
            pluginManager.commands[command].name +
            " " +
            pluginManager.commands[command].parameters.params,
          pluginManager.commands[command].help,
          true
        );
      } else {
        embed.addField(
          process.env.prefix + pluginManager.commands[command].name,
          pluginManager.commands[command].help,
          true
        );
      }
    }
    msg.channel.send({ embed });
  },
});

client.on("guildCreate", async (guild) => {
  createServer(guild, knex);
});

client.on("guildUpdate", async (guild) => {
  knex(tableNames.server)
    .where({ discord_ID: guild.id })
    .first()
    .then((server) => {
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
  if (msg.content.indexOf(prefix || process.env.prefix) !== -1) {
    var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
    var args = util.args.parse(msg);
    if (command in pluginManager.commands) {
      if (process.env.delete_commands == true) msg.delete();
      if (
        !args.length ==
          pluginManager.commands[command].parameters.params.length &&
        pluginManager.commands[command].parameters.params.required
      ) {
        let reply = `You didn't provide any arguments, ${msg.author}!`;

        if (pluginManager.commands[command].parameters.params) {
          reply += `\nThe proper usage would be: \`${process.env.prefix}${pluginManager.commands[command].name} ${pluginManager.commands[command].parameters.params}\``;
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

var token = knex("settings")
  .first()
  .then(async (data) => {
    var token = data["token"];
    var prefix = data["prefix"];
    console.log("———————— Plugit! ————————");
    console.log(token);
  });

module.exports = client;
