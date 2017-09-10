module.exports = {
  ping: {
    name: "ping",
    main: function(bot, msg) {
      msg.channel.send("Pong!")
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
    help: 'Clear The Last x Messages In the chat'
  }
};
