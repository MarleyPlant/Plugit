const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs")
var config = require('./config');
var commands = {}; //Create Dictionary to store Commands

var loadCommands = function() {
    var files = fs.readdirSync("./modules/");
    for (let file of files) {
        if (file.endsWith('.js')) {
          commands[file.slice(0, -3)] = require("./modules/" + file);
  			  if(config.debug) {
              console.log("Loaded " + file);
          }
    }
  }
    console.log("———— All Commands Loaded! ————");
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame(config.playing)
  loadCommands();
});

client.on('message', msg => {
  if ( msg.content.split(config.prefix)[1].split(" ")[0] ) {
    var command = msg.content.split("!")[1];
    if(command in commands){
      if(config.delete_commands){
         msg.delete();
      }
      commands[command].main(client, msg);
    }
  }
});

client.login(config.token);
