function getGuild(callback) {
  knex(tableNames.server).where({ discord_ID: guild.id }).first().then(callback);
}

module.exports = getGuild;