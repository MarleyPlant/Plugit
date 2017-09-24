const Discord = require("discord.js");
const fs = require("fs");
const glob = require("glob");
const archy = require("archy");
const log = require(__dirname + '/../lib/log');
const path = require('path');
const chalk = require('chalk');
var client = new Discord.Client();
var commands = {}; //Create Dictionary to store Commands

function getModulesPaths () {
  if (process.env.NODE_ENV === 'test') {
    return [path.join(__dirname, '..', 'test')];
  }
  var sep = (process.platform === 'win32') ? ';' : ':';
  var paths = [];

  if (process.env.NODE_PATH) {
    paths = paths.concat(process.env.NODE_PATH.split(sep));
  } else {
    if (process.platform === 'win32') {
      paths.push(path.join(process.env.APPDATA, 'npm', 'node_modules'));
    } else {
      paths.push('/usr/lib/node_modules');
    }
  }
  return paths;
}

function findModules (searchpaths) {
  return searchpaths.reduce(function (arr, searchpath) {
    return arr.concat(glob.sync('{@*/,}plugit-*', {cwd: searchpath, stat: true}).map(function (match) {
      var Module = {path: path.join(searchpath, match), name: match.replace(/(?:@[\w]+[\/|\\]+)?plugit-/, ""), pkg: {}};
      try {
        Module.pkg = require(path.join(searchpath, match, 'package.json'));
      } catch (e) {
        console.log(e)
      }
      return Module;
    }));
  }, []);
}

function getAllModules () {
  return findModules(getModulesPaths());
}

function logModules(Modules) {
  var tree = {
    label: 'Installed Modules',
    nodes: Modules.map(function (gen) {
      return {label: gen.name + (gen.pkg.version ? chalk.grey(' (' + gen.pkg.version + ')') : '')};
    })
  };
  archy(tree).split('\n').forEach(function(v) {
    if (v.trim().length === 0) return;
    log(v);
  });
}

var loadCommands = function() {
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

    //Load NPM Modules
    var modules = getAllModules();
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
  logModules(getAllModules());
  client.user.setGame(process.env.playing)
  loadCommands();
});

client.on('message', msg => {
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
