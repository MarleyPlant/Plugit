var pg = require('pg');

var db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

module.exports = db
