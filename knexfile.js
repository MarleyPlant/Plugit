require('dotenv').config();

module.exports = {
    development: {
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
          filename: './dev.sqlite3',
        },
    },
};