const util = require("plugit-util");

module.exports = {
  commands: {
    ping: {
      name: "ping",
      help: 'Ping the bot',
      main: function(bot, msg) {
        msg.channel.send(`${bot.ping}ms pong!`)
      },
    },

    clear: {
      name: "clear",
      parameters: "(Number)",
      help: "clear messages from the chat.",
      main: function(bot, msg) {
        args = util.args.parse(msg)
        msg.channel.fetchMessages({limit: args[0]}).then(
          messages => msg.channel.bulkDelete(messages)
        )
      }
    },

    stats: {
      name: "stats",
      help: "Display statistics for the bot instance." ,
      main: function(bot,msg) {
        msg.channel.send(`Connected to ${bot.guilds.size} guilds, serving ${bot.users.size} users.`)
      }
    }
  },

  events: {
  }
};
