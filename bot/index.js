const Discord = require("discord.js");
const fs = require("fs");
const pg = require('pg');
const util = require("./util");

// Allow use of .env in a development enviroment
try {
  require('dotenv').config()
} //If not in heroku enviroment then allow access to env veriable
catch (e) {

}

//Create Clients
const knex = require('knex')({
  client: 'pg',
  connection: 'postgres://admin:admin@postgres:5432/plugit'
})

const client = new Discord.Client();
const pluginManager = new util.pluginManager( __dirname + "/../modules/" )

//Help Command
pluginManager.addCommand({
  name: "help",
  help: "Display A List of Commands And Their Features!",
  main: function(bot, knex, msg) {
    embed = new Discord.RichEmbed()
    .setTitle("Bot Commands")
    for (command in pluginManager.Commands) {
      if(pluginManager.Commands[command].parameters){
        embed.addField(process.env.prefix + pluginManager.Commands[command].name + " " + pluginManager.Commands[command].parameters, pluginManager.Commands[command].help, true);
      } else {
        embed.addField(process.env.prefix + pluginManager.Commands[command].name, pluginManager.Commands[command].help, true);
      }
    }
    msg.channel.send({embed})
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Connected to ${client.guilds.size} guilds, serving ${client.users.size} users.`);
  client.user.setActivity(process.env.playing)

  pluginManager.loadModules();
  pluginManager.listModules();

  //Handle events
  if (pluginManager.events['ready']) {
    pluginManager.events['ready'].main(client, knex)
  }

  for (event in pluginManager.events) {
    if (event == 'message') return
    client.on(event, (arg1) => {
      pluginManager.events[event].main(client, knex, arg1)
    })
  }
});


//Handle Commands
client.on('message', msg => {
  if ( msg.author.bot ) return //If message is from a bot ignore.
  if ( msg.content.indexOf(process.env.prefix) !== -1 ) {
    var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
    if(command in pluginManager.Commands){
      if(process.env.delete_commands == true) msg.delete()
      pluginManager.Commands[command].main(client, knex, msg);
    }
  }

  if (pluginManager.events["message"]) {
    pluginManager.events["message"].main(client, knex, msg)
  }
});

client.on('disconnect', data => {
  console.log("Discord Client Shutdown!")
})


console.log("———————— Plugit! ————————");
client.login(process.env.token); //Connect to Discord
