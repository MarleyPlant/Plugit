var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuth = require('../helpers/isAuth');


router.get('/', isAuth, passport.authenticate('discord'));

router.get('/logout', (req, res) => {
  if(req.user) {
    req.logout();
    res.redirect('/');
  } else {
    res.redirect('/');
  }
})

/* GET auth listing. */
router.get('/redirect', isAuth, passport.authenticate('discord' , {
  failureRedirect: '/forbidden'
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;
