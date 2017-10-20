const util = require("plugit-util");

module.exports = {
  commands: {
    ping: {
      name: "ping",
      help: 'Ping the bot',
      main: function(bot, db, msg) {
        msg.channel.send(`${bot.ping}ms pong!`)
      },
    },

    clear: {
      name: "clear",
      parameters: "(number)",
      help: "clear messages from the chat.",
      main: function(bot, db, msg) {
        args = util.args.parse(msg)
        msg.channel.fetchMessages({limit: args[0]}).then(
          messages => msg.channel.bulkDelete(messages)
        )
      }
    },

    stats: {
      name: "stats",
      help: "Display statistics for the bot instance." ,
      main: function(bot, db, msg) {
        msg.channel.send(`Connected to ${bot.guilds.size} guilds, serving ${bot.users.size} users.`)
      }
    },

    softban: {
      name: "softban",
      help: "Ban then unban a user to delete messages",
      parameters: "(user)",
      main: function(bot, db, msg) {
        mentioned = msg.mentions.members.first()
        if (msg.member.hasPermission("BAN_MEMBERS")) {
          msg.guild.ban(mentioned.id)
          msg.guild.unban(mentioned.id)

          msg.react("👍")
        }
        else {
          util.notifications.warn(msg, msg.author + " Attempted to softban user " + mentioned)
        }
      }
    }
  },

  events: {
  }
};
