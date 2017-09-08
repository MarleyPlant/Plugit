const Discord = require("discord.js");
const client = new Discord.Client();
var config = require('./config')


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame(config.playing)
});

client.on('message', msg => {
  if ( msg.content.split(config.prefix)[1].split(" ")[0]) {
    if (msg.content === '!ping') {
      msg.reply('Pong!');
    }
  }
});

client.login(config.token);
