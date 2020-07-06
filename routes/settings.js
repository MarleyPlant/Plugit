var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuth = require('../helpers/isAuth');


router.get('/', isAuth, function(req, res, next) {
res.render('settings', {
    title: 'Plugit - Settings'
});
});

module.exports = router;
