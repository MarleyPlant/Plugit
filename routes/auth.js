var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuth = require('../helpers/isAuth');


router.get('/', isAuth.isAuth, passport.authenticate('discord'));

/* GET auth listing. */
router.get('/redirect', isAuth.isAuth, passport.authenticate('discord' , {
  failureRedirect: '/forbidden'
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
