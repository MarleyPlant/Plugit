var chalk = require("chalk");
var glob = require("glob");
var path = require("path");
var archy = require("archy");
var fs = require("fs");

class PluginManager {
  constructor(searchDirectory) {
    this.commands = {};
    this.events = {};
    this.searchDirectory = searchDirectory;
    this.plugins = PluginManager.getModules();
  }

  addCommand(command) {
    this.commands[command.name] = command;
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

  static getModules() {
    return PluginManager.find(PluginManager.getPaths());
  }

  static getPaths() {
    if (process.env.NODE_ENV === "test") {
      return [path.join(__dirname, "..", "test")];
    }
    var sep = process.platform === "win32" ? ";" : ":";
    var paths = [];

    if (process.env.NODE_PATH) {
      paths = paths.concat(process.env.NODE_PATH.split(sep));
    } else {
      if (process.platform === "win32") {
        paths.push(path.join(process.env.APPDATA, "npm", "node_modules"));
      } else {
        paths.push("/usr/lib/node_modules");
      }
    }
    return paths;
  }

  static find(searchpaths) {
    return searchpaths.reduce(function (arr, searchpath) {
      return arr.concat(
        glob
          .sync("{@*/,}plugit-*", { cwd: searchpath, stat: true })
          .map(function (match) {
            var Module = {
              path: path.join(searchpath, match),
              name: match.replace(/(?:@[\w]+[\/|\\]+)?plugit-/, ""),
              pkg: {},
            };
            try {
              Module.pkg = require(path.join(
                searchpath,
                match,
                "package.json"
              ));
            } catch (e) {
              console.log(e);
            }
            return Module;
          })
      );
    }, []);
  }

  loadModule(plugin, path) {
    try {
      if (plugin.path){
        var module = require(plugin.path + "/" + plugin.pkg.main);
      } else {
        var module = require(path + "/" + plugin);
      }
    } catch (e) {
      console.log(e);
    } finally {
      for (let command of Object.keys(module.commands)) {
        this.commands[command] = module.commands[command];
      }

      for (let event of Object.keys(module.events)) {
        this.events[event] = module.commands[event];
      }
    }
  }

  loadModules() {
    //Load NPM Modules
    for (let plugin of this.plugins) {
      this.loadModule(plugin, plugin.path);
    }

    //Load Local Modules
    var files = fs.readdirSync(this.searchDirectory);
    for (let file of files) {
      if (file.endsWith(".js")) {
        this.loadModule(file, this.searchDirectory);
      }
    }
  }
}

module.exports = PluginManager;
