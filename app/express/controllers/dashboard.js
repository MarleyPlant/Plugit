var router = require('express').Router();
var midware = require('../middleware').isLoggedIn


router.get('/', midware, function(req, res, next){
  res.render('dashboard', {title: 'dashboard', user: req.user});
});


module.exports = router;
