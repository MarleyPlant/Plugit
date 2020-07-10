require("dotenv").config();
const { MessageEmbed, Client } = require("discord.js");
const tableNames = require("./constants/tableNames");
const { Connection } = require("pg");
const knex = require("knex")(require("./knexfile").development);
const util = require("./util");

const client = new Client();
const pluginManager = new util.pluginManager(__dirname + "/modules/");

function updateServer(guild) {
  knex(tableNames.server)
    .where({ discord_ID: guild.id })
    .update({ name: guild.name, memberCount: guild.memberCount, icon: guild.iconURL() }, ['id', 'name', 'memberCount', 'icon'])
    .catch(function (e) {
      console.log(e);
    });
}

function createServer(guild) {
  knex(tableNames.server)
    .insert({ name: guild.name, discord_ID: guild.id, memberCount: guild.memberCount, icon: guild.iconURL() })
    .catch(function (e) {
      console.log(e);
    });
}


client.on("ready", () => {
  guilds = client.guilds.cache.array()

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
  createServer(guild);
});

client.on("guildUpdate", async (guild) => {
  knex(tableNames.server)
  .where({ discord_ID: guild.id })
  .first()
  .then((server) => {
    if(!server) {
      createServer(guild);
    }
    else { 
      updateServer(guild);
    }
  })
});

//Handle commands
client.on('message', (msg) => {
    if ( msg.author.bot ) return //If message is from a bot ignore.
    if ( msg.content.indexOf(process.env.prefix) !== -1 ) {
      var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
      var args = util.args.parse(msg);
      if(command in pluginManager.commands){
        if(process.env.delete_commands == true) msg.delete()
        if (!args.length == pluginManager.commands[command].parameters.params.length && pluginManager.commands[command].parameters.params.required) {
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
      pluginManager.events["message"].main(client, knex, msg)
    }
});  

console.log("———————— Plugit! ————————");
client.login(process.env.TOKEN);

module.exports = client;