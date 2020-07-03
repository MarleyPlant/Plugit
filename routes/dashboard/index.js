var express = require('express');
var router = express.Router();
var serverRouter = require('./server');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.use('/server', serverRouter);

module.exports = router;
