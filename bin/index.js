const Discord = require("discord.js");
const fs = require("fs");
const util = require("plugit-util");
const pg = require('pg');


//Create Clients
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
const client = new Discord.Client();


//Initialize Variables
var commands = {}; //Create Dictionary to store Commands
var events = {};


//Help Command
commands["help"] = {
  name: "help",
  help: "Display A List of Commands And Their Features!",
  main: function(bot, msg) {
    embed = new Discord.RichEmbed()
    .setTitle("Bot Commands")
    for (command in commands) {
      if(commands[command].parameters){
        embed.addField(process.env.prefix + commands[command].name + " " + commands[command].parameters, commands[command].help, true);
      } else {
        embed.addField(process.env.prefix + commands[command].name, commands[command].help, true);
      }
    }
    msg.channel.send({embed})
  }
}


var loadModules = function() {
    //Load NPM Modules
    var modules = util.modules.getModules();
    for (let file of modules) {
      try {
        var module = require(file.path + "/" + file.pkg.main);
      }
      catch (e) {
        console.log("Skipped " + module)
      }
      finally {
        for (command in module.commands) {
          commands[command] = module.commands[command];
        }

        for (event in module.events) {
          events[event] = module.commands[event];
        }
      }
    }

    //Load Local Modules
    var files = fs.readdirSync(__dirname + "/../modules/");
    for (let file of files) {
      if (file.endsWith('.js')) {
        var module = require(__dirname + "/../modules/" + file);
        for (command in module.commands) {
          commands[command] = module.commands[command];
        }
        for (event in module.events) {
          events[event] = module.events[event]
        }
        if(process.env.debug == true) {
            console.log("Loaded " + file.slice(0, -3) + " Module");
        }
      }
    }
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Connected to ${client.guilds.size} guilds, serving ${client.users.size} users.`);
  client.user.setGame(process.env.playing)

  //Load commands & events
  loadModules();
  util.modules.logModules(util.modules.getModules());

  //Handle events
  if (events['ready']) {
    events['ready'].main(client, db)
  }

  for (event in events) {
    if (event == 'message') return
    client.on(event, (arg1) => {
      events[event].main(client, db, arg1)
    })
  }
});


//Handle Commands
client.on('message', msg => {
  if ( msg.author.bot ) return //If message is from a bot ignore.
  if ( msg.content.indexOf(process.env.prefix) !== -1 ) {
    var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
    if(command in commands){
      if(process.env.delete_commands == true) msg.delete()
      commands[command].main(client, db, msg);
      return
    }
    return
  }

  if (events["message"]) {
    events["message"].main(client, db, msg)
  }
});


//Connect to Discord
console.log("———————— Plugit! ————————");

db.connect()
  .then(() => console.log(`Successfully Connected To Database`))
  .catch(e => console.error('Connection error', err.stack))


client.login(process.env.token);
