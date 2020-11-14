const updateServer = require('../../../helpers/updateServer');
const createServer = require('../../../helpers/createServer');
const tableNames = require("../../../constants/tableNames");

module.exports = {
  name: "update",
  parameters: {
    params: [],
    required: false,
  },
  help: "Update Server Information And Icon On Bots Dashboard.",
  main: function (bot, db, msg) {
    db(tableNames.server)
      .where({ discord_ID: msg.guild.id })
      .first()
      .then((server) => {
        if (!server) {
          createServer(msg.guild, db);
          msg.channel.send("Created Guild Entry In Database!");
        } else {
          updateServer(msg.guild, db);
          msg.channel.send("Updated Guild In Database.");
        }
      });
  },
};
