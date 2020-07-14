const tableNames = require("../constants/tableNames");

module.exports = function createServer(guild, db='') {
    if (db == '') {
        knex(tableNames.server)
        .insert({ name: guild.name, discord_ID: guild.id, memberCount: guild.memberCount, icon: guild.iconURL() })
        .catch(function (e) {
            console.log(e);
        });
    } else {
        db(tableNames.server)
            .insert({ name: guild.name, discord_ID: guild.id, memberCount: guild.memberCount, icon: guild.iconURL() })
            .catch(function (e) {
                console.log(e);
            });
    }
}