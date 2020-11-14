module.exports = {
  name: "server",
  parameters: {
    params: [],
    required: false,
  },
  help: "Check server information",
  main: function (bot, db, msg) {
    msg.channel.send(
      `Server name: ${msg.guild.name}\nTotal members: ${msg.guild.memberCount}`
    );
  },
};
