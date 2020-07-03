require("dotenv").config();
const { MessageEmbed, Client } = require("discord.js");
const tableNames = require("./constants/tableNames");
const { Connection } = require("pg");
const knex = require("knex")(require("./knexfile").development);
const util = require("./util");

const client = new Client();
const pluginManager = new util.pluginManager(__dirname + "/modules/");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(
    `Connected to ${client.guilds.length} guilds, serving ${client.users.size} users.`
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
  main: function (bot, knex, msg) {
    embed = new MessageEmbed().setTitle("Bot commands");
    for (command in pluginManager.commands) {
      if (pluginManager.commands[command].parameters) {
        embed.addField(
          process.env.prefix +
            pluginManager.commands[command].name +
            " " +
            pluginManager.commands[command].parameters,
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
  var newuser = knex(tableNames.server)
    .insert({ discord_ID: guild.id, name: guild.name })
    .catch(function (e) {
      done(false, e);
    });
});

//Handle commands
client.on('message', (msg) => {
    if ( msg.author.bot ) return //If message is from a bot ignore.
    if ( msg.content.indexOf(process.env.prefix) !== -1 ) {
      var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
      if(command in pluginManager.commands){
        if(process.env.delete_commands == true) msg.delete()
        pluginManager.commands[command].main(client, knex, msg);
      }
    }
  
    if (pluginManager.events["message"]) {
      pluginManager.events["message"].main(client, knex, msg)
    }
});  

console.log("———————— Plugit! ————————");
client.login(process.env.TOKEN);
