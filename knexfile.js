var pg = require('pg');
pg.defaults.ssl = true;
try {
  require('dotenv').config()
} //If not in heroku enviroment then allow access to env veriable
catch (e) {
  
}

module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
}
