const discord = require('discord.js');
const manager = new discord.ShardingManager(`${__dirname}/index.js`, { totalShards: process.env.shards})

manager.spawn()
manager.on("launch", shard => {
  if (process.env.debug) {
    console.log(`Launched Shard: ${shard.id}`)
  }
})
