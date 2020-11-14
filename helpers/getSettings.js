const knex = require("knex")(require("../knexfile").development);

function getSettings(callback) {
  knex("settings").first().then(callback);
}

module.exports = getSettings;
