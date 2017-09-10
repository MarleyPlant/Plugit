const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const glob = require("glob");
const archy = require("archy");
const log = require(__dirname + '/../lib/log');
const path = require('path');
const chalk = require('chalk');
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
    var modules = getAllModules();
    for (let module of modules) {
      commands[module.name] = require(module.path + "/" + module.pkg.main);
      if(config.debug) {
        console.log("Loaded " + module.name);
      }
    }

    var files = fs.readdirSync(__dirname + "/../modules/");
    for (let file of files) {
        if (file.endsWith('.js')) {
          commands[file.slice(0, -3)] = require(__dirname + "/../modules/" + file);
  			  if(process.env.debug) {
              console.log("Loaded " + file);
          }
    }
  }
  console.log("———— Commands Loaded! ————");
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('Installed NPM Modules: ');
  logModules(getAllModules());
  client.user.setGame(process.env.playing)
  loadCommands();
});

client.on('message', msg => {
  if ( msg.content.indexOf('!') !== -1 ) {
    var command = msg.content.split(process.env.prefix)[1].split(" ")[0];
    if(command in commands){
      if(process.env.delete_commands){
         msg.delete();
      }
      commands[command].main(client, msg);
    }
  }
});

client.login(process.env.token);
