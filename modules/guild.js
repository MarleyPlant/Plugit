function updateServer(db, guild) {
  db(tableNames.server)
    .where({ discord_ID: guild.id })
    .update({ name: guild.name, memberCount: guild.memberCount, icon: guild.iconURL() }, ['id', 'name', 'memberCount', 'icon'])
    .catch(function (e) {
      console.log(e);
    });
}

function createServer(db, guild) {
  db(tableNames.server)
    .insert({ name: guild.name, discord_ID: guild.id, memberCount: guild.memberCount, icon: guild.iconURL() })
    .catch(function (e) {
      console.log(e);
    });
}

const tableNames = require("../constants/tableNames");

module.exports = {
    commands: {
        updatedashboard: {
            name: "updatedashboard",
            parameters: {
              params: [],
              required: false,
            },
            help: "Update Server Information And Icon On Bots Dashboard.",
            main: function(bot, db, msg) {
              db(tableNames.server)
              .where({ discord_ID: msg.guild.id })
              .first()
              .then((server) => {
                if(!server) {
                  createServer(db, msg.guild);
                  msg.channel.send("Created Guild Entry In Database!");
                }
                else { 
                  updateServer(db, msg.guild);
                  msg.channel.send("Updated Guild In Database.");
                }
              })
            }
        },
    },
    events : {
        
    }
}