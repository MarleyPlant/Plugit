module.exports = {
    main: function(bot, msg) {
      msg.channel.fetchMessages({limit: 10}).then(
        messages => msg.channel.bulkDelete(messages)
      );
    },
    help: 'Clear The Last 10 Messages In the chat'
};
