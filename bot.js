require('dotenv').config();
const { Client } = require('discord.js');
const tableNames = require('./constants/tableNames');
const { Connection } = require('pg');
const knex = require('knex')(require('./knexfile').development);

const client = new Client();

client.on('ready', () => {
    console.log(`${client.user.tag} Logged In`);
});

client.on('guildCreate', async (guild) => {
    var newuser = knex(tableNames.server).insert({ discord_ID: guild.id, name: guild.name }).catch(function(e) {
        done(false,e);
    });
})

client.login(process.env.token)