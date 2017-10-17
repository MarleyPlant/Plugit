const Discord = require("discord.js");
const fs = require("fs");
const util = require("plugit-util");
const client = new Discord.Client();

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

var loadCommands = function() {
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
        if(process.env.debug) {
            console.log("Loaded " + file.slice(0, -3) + " Module");
        }
      }
    }
    console.log("———— Modules Loaded! ————");
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Connected to ${client.guilds.size} guilds, serving ${client.users.size} users.`);
  loadCommands();
  util.modules.logModules(util.modules.getModules());
  client.user.setGame(process.env.playing)

  for (event in events) {
    client.on(event, (arg1, arg2, arg3) => {
      events[event].main(client, arg1)
    })
  }
});

client.on('message', msg => {
  if ( msg.author.bot ) return
  if ( msg.content.indexOf(process.env.prefix) !== -1 ) {
    var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
    if(command in commands){
      if(process.env.delete_commands == true){
         msg.delete();
      }
      commands[command].main(client, msg);
    }
  }

  if (events["message"]) {
    events["message"].main(client, msg)
  }
});

client.login(process.env.token);
