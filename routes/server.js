var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuth = require('../helpers/isAuth');
const knex = require('knex')(require('../knexfile').development);
const util = require("../util");

router.get('/', isAuth, function(req, res, next) {
    res.redirect('/');
});

router.get('/:server', function(req, res, next) {
  knex('servers').where({discord_ID: req.params.server}).first()
  .then((server) => {
    res.render('server', { 
      title: `Pluit - ${server.name}`,
      server: server
    });
    })
  .catch((err) => { console.log(err) });
});

module.exports = router;
