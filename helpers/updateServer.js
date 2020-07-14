const tableNames = require("../constants/tableNames");

module.exports = function updateServer(guild, db='') {
    if (db == '') {
        knex(tableNames.server)
        .where({ discord_ID: guild.id })
        .update({ name: guild.name, memberCount: guild.memberCount, icon: guild.iconURL() }, ['id', 'name', 'memberCount', 'icon'])
        .catch(function (e) {
            console.log(e);
        });
    } else {
        db(tableNames.server)
            .where({ discord_ID: guild.id })
            .update({ name: guild.name, memberCount: guild.memberCount, icon: guild.iconURL() }, ['id', 'name', 'memberCount', 'icon'])
            .catch(function (e) {
                console.log(e);
            });
    }
}