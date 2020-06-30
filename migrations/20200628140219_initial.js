const tableNames = require('../constants/tableNames');
const knex = require('knex');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    table.string('email', 254).notNullable().unique();
    table.text('name').notNullable();
    table.string('password', 500).notNullable();
    table.dateTime('last_login').notNullable();
  });
};

exports.down = function(knex) {
  
};
