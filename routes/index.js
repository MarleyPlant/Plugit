var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../knexfile').development);

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.render('index', { title: 'Plugit - Sign In!' });
  } else {
    knex('servers')
    .then((servers) => {
      knex('users').where({id: 1}).first()
      .then((user) => { 
        servers_to_render = [];
        guilds = JSON.parse(user.guilds);
        for (let server of servers) {
          if (guilds.includes(server.discord_ID)) {
            servers_to_render.push(server);
          }
        }
        res.render('dashboard', { 
          servers: servers_to_render,
          title: 'Plugit - Dashbaord'
        });
       })
      .catch((err) => { console.log(err) });
    
     })
    .catch((err) => { console.log(err) });
  }
});

module.exports = router;
