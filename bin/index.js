const Discord = require("discord.js");
const fs = require("fs");
const util = require("plugit-util");
const client = new Discord.Client();

var commands = {}; //Create Dictionary to store Commands
//Help Command
commands["help"] = {
  name: "help",
  help: "Display A List of Commands And Their Features!",
  main: function(bot, msg) {
    embed = new Discord.RichEmbed()
    .setAuthor(client.user.username, client.user.defaultAvatarURL)
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
      var module = require(file.path + "/" + file.pkg.main);
      for (command in module) {
        commands[command] = module[command];
      }
    }

    //Load Local Modules
    var files = fs.readdirSync(__dirname + "/../modules/");
    for (let file of files) {
      if (file.endsWith('.js')) {
        var module = require(__dirname + "/../modules/" + file);
        for (command in module) {
          commands[command] = module[command];
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
});

client.login(process.env.token);
