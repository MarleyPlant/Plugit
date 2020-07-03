var express = require('express');
var router = express.Router();
var serverRouter = require('./server');
var settingsRouter = require('./settings');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.use('/server', serverRouter);
router.use('/settings', settingsRouter);

module.exports = router;
