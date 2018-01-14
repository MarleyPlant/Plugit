const Discord = require("discord.js");
const fs = require("fs");
const util = require("plugit-util");
const client = new Discord.Client();

var commands = {}; //Create Dictionary to store Commands

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

loadCommands();
util.modules.logModules(util.modules.getModules());
