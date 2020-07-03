var express = require('express');
var router = express.Router();
var serverRouter = require('./server');
var settingsRouter = require('./settings');
const knex = require('knex')(require('../../knexfile').development);

/* GET users listing. */
router.get('/', function(req, res, next) {
  let servers = [
    {
      title: 'Server 1',
      id: 1,
      discord_ID: 325252,
      description: 'This is an example server to be connected to the database',
    },
    {
      title: 'Server 2',
      id: 2,
      discord_ID: 325236,
      description: 'This is an example server to be connected to the database',
    },
    {
      title: 'Server 3',
      id: 3,
      discord_ID: "702971988351647907",
      description: 'This is an example server to be connected to the database',
    },
    {
      title: 'Server 4',
      id: 4,
      discord_ID: "363250326603563009",
      description: 'This is an example server to be connected to the database',
    },
  ];

  knex('users').where({id: 5}).first()
  .then((user) => { 
    servers_to_render = [];
    for (let server of servers) {
      console.log(server.discord_ID)
      if (user.guilds.includes(server.discord_ID)) {
        servers_to_render.push(server);
      }
    }
   })
  .catch((err) => { console.log(err) });
  

  console.log(servers_to_render);
  res.render('dashboard', { servers: servers_to_render });
});

router.use('/server', serverRouter);
router.use('/settings', settingsRouter);

module.exports = router;
