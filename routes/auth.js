var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', passport.authenticate('discord'));

/* GET auth listing. */
router.get('/redirect', passport.authenticate('discord' , {
  failureRedirect: '/forbidden'
}), (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;
