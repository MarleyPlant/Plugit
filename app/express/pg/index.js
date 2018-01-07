var pg = require('pg');
var config = require('../../config.json')

var db = new pg.Client({
  connectionString: process.env.DATABASE_URL || config.connectionString, //Heroku Config Var or Config File
  ssl: true,
});

module.exports = db
