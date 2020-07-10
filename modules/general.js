const util = require("../util");

module.exports = {
  commands: {
    clear: {
      name: "clear",
      parameters: {
        params: ["(number)"],
        required: false,
      },
      help: "clear messages from the chat.",
      main: function(bot, db, msg) {
        args = util.args.parse(msg);
        if(args[0] == null) {
          msg.channel.bulkDelete(10);
        } else {
          msg.channel.bulkDelete(args[0]);
        }
      }
    },

    stats: {
      name: "stats",
      help: "Display statistics for the bot instance." ,
      parameters: {
        params: [""],
        required: false,
      },
      main: function(bot, db, msg) {
        guilds = bot.guilds.cache.array()

        msg.channel.send(`I am currently connected to and serving ${guilds.length} guilds`)
      }
    },  

    banned: {
      name: "banned",
      help: "Displays A List Of Banned Users.",
      parameters: {
        params: ["(user)"],
        required: true,
      },
      main: function(bot, db, msg) {
        msg.channel.send("Display Banned Users");
      }
    }
  },

  events: {
  }
};
