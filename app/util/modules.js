var chalk = require('chalk');
var glob = require('glob');
var path = require('path');
var archy = require('archy');

class modules {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  static logModules(Modules) {
    var tree = {
      label: 'Installed Modules',
      nodes: Modules.map(function (gen) {
        return {label: gen.name + (gen.pkg.version ? chalk.grey(' (' + gen.pkg.version + ')') : '')};
      })
    };
    archy(tree).split('\n').forEach(function(v) {
      if (v.trim().length === 0) return;
      modules.log(v);
    });
  }

  static log() {
    'use strict';
    var sig = `[${chalk.green('Plugit')}]`;
    var args = Array.prototype.slice.call(arguments);
    args.unshift(sig);
    console.log.apply(console, args);
    return this;
  }

  static getModules () {
    return modules.find(modules.getPaths());
  }

  static getPaths () {
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

  static find (searchpaths) {
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

}

module.exports = modules;
