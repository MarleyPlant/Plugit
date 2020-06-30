const tableNames = require('../constants/tableNames');
const knex = require('knex');

function addDefaultColumns(table) {
  table.dateTime('created_at');
}

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    table.string('email', 254).notNullable().unique();
    table.text('name').notNullable();
    table.string('password', 500).notNullable();
    table.dateTime('last_login').notNullable();
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.user);
};
