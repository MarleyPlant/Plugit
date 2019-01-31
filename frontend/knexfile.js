var pg = require('pg');

try {
  require('dotenv').config()
} //If not in heroku enviroment then allow access to env veriable
catch (e) {

}

module.exports = {
  client: 'pg',
  connection: 'postgres://admin:admin@postgres:5432/plugit'
}
