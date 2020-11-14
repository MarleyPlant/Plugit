var chalk = require("chalk");
var glob = require("glob");
var path = require("path");
var archy = require("archy");
const { exit } = require("process");
var fs = require("fs").promises;

class PluginManager {
  constructor(searchDirectory) {
    this.commands = {};
    this.events = {};
    this.searchDirectory = path.join("/modules/");
    this.plugins = [];
    this.settings = [];
  }

  addCommand(command) {
    this.commands[command.name] = command;
  }

  addEvent(event) {
    this.events[event.name] -= event;
  }

  listModules() {
    var tree = {
      label: "Installed Modules",
      nodes: this.plugins.map(function (gen) {
        return {
          label:
            gen.name +
            (gen.pkg.version ? chalk.grey(" (" + gen.pkg.version + ")") : ""),
        };
      }),
    };

    archy(tree)
      .split("\n")
      .forEach(function (v) {
        if (v.trim().length === 0) return;
        PluginManager.log(v);
      });
  }

  static log() {
    "use strict";
    var sig = `[${chalk.green("Plugit")}]`;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(sig);
    console.log.apply(console, args);
    return this;
  }

  async loadModule(path) {
    var module = require(path);
    var stat = await fs.lstat(path);

    if (stat.isDirectory()) {
      try {
        this.plugins.push(require(path + "\package.json"));
      } catch {
        
      }
    }

    if (module.commands && module.events) {
      for (var command in module.commands) {
        this.addCommand(module.commands[command]);
      }

      for (event in module.events) {
        this.addEvent(event);
      }
    }
  }

  async loadModules() {
    var files = await fs.readdir("./modules");
    for (var file in files) {
      this.loadModule(path.join(__dirname + "/../modules/" + files[file]));
    }
  }
}

module.exports = PluginManager;
