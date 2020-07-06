var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuth = require('../helpers/isAuth');

router.get('/', function(req, res, next) {
    res.redirect('/');
  });

  router.get('/server1', isAuth.isAuth, function(req, res, next) {
    res.render('server', { server: {title: 'server 1'}});
  });

module.exports = router;
