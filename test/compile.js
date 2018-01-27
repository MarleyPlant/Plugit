const fs = require("fs");
const util = require("../app/util/index");

var loadCommands = function(callback) {
    var commands = {}; //Create Dictionary to store Commands
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

    callback(commands);
}

describe('Should Compile Local And NPM Modules', () => {
  it('Should create dictionary to store commands', (done) => {
    loadCommands(function (commands) {
      commands.should.have.own.property("events");
      commands.should.have.own.property("commands");
      done();
    });
  })

  describe('Should Include All Local Commands', (done) => {
    it('Should Include Ping Command', (done) => {
      loadCommands(function (commands) {
        commands.commands.should.have.own.property("ping");
        done();
      });
    })
    it('Should Include Clear Command', (done) => {
      loadCommands(function (commands) {
        commands.commands.should.have.own.property("clear");
        done();
      });
    })
    it('Should Include Stats Command', (done) => {
      loadCommands(function (commands) {
        commands.commands.should.have.own.property("stats");
        done();
      });
    })
  })
})
