const Discord = require("discord.js");
const client = new Discord.Client();
var config = require('../src/config')


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log('Your Discord API Credentials seem to be correct.')
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});

client.login(config.token);
