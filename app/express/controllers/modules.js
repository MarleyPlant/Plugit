var router = require('express').Router();
var midware = require('../middleware').isLoggedIn

modules = [
  {
    name: "Example Module 1",
    url: "http://github.com/example/1"
  },
  {
    name: "Example Module 2",
    url: "http://github.com/example/2"
  }
] //Create object like this from api data

router.get('/', midware, function(req, res, next){
  res.render('modules', {title: 'modules', user: req.user, modules: modules});
});


module.exports = router;
