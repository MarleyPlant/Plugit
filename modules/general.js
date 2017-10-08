module.exports = {
  ping: {
    name: "ping",
    main: function(bot, msg) {
      msg.channel.send(`${bot.ping}ms pong!`)
    },
    help: 'Ping the bot'
  },
  clear: {
    name: "clear",
    parameters: "(Number)",
    main: function(bot, msg) {
      args = msg.content.split(" ");
      msg.channel.fetchMessages({limit: args[1]}).then(
        messages => msg.channel.bulkDelete(messages)
      );
    },
  stats: {
    name: "stats"
    main: function(bot,msg) {

    }
  }
  }
};
