var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
    res.redirect('/dashboard');
  });

  router.get('/server1', function(req, res, next) {
    res.render('server', { server: {title: 'server 1'}});
  });

module.exports = router;
