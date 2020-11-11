const tableNames = require('../constants/tableNames');
const knex = require('knex');

function addDefaultColumns(table) {
  table.dateTime('created_at');
}

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.user, (table) => {
    table.increments().notNullable();
    table.text('name');
    table.text('discord_ID').notNullable().unique();
    table.text('guilds').notNullable();
    table.dateTime('last_login');
    addDefaultColumns(table);
  });

  await knex.schema.createTable("settings", (table) => {
    table.increments().notNullable();
    table.text('token');
    table.text('prefix');
    table.text('clientid');
    table.text('clientsecret');
  })

  await knex.schema.createTable(tableNames.server, (table) => {
    table.increments().notNullable();
    table.text('name').notNullable();
    table.text( 'discord_ID').notNullable().unique();
    table.text('directory').unique();
    table.text('icon');
    table.int('memberCount').notNullable();
    addDefaultColumns(table);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.user);
  await knex.schema.dropTable(tableNames.server);
  await knex.schema.dropTable('sessions');
  await knex.schema.dropTable("settings");
};
