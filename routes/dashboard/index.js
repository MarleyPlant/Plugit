var express = require('express');
var router = express.Router();
var serverRouter = require('./server');
var settingsRouter = require('./settings');

/* GET users listing. */
router.get('/', function(req, res, next) {
  let servers = [
    {
      title: 'Server 1',
      id: 1,
      discord_ID: 325252,
      description: 'This is an example server to be connected to the database',
    },
    {
      title: 'Server 2',
      id: 2,
      discord_ID: 325236,
      description: 'This is an example server to be connected to the database',
    },
    {
      title: 'Server 3',
      id: 3,
      discord_ID: 23759,
      description: 'This is an example server to be connected to the database',
    },
    {
      title: 'Server 4',
      id: 4,
      discord_ID: 23759,
      description: 'This is an example server to be connected to the database',
    },
  ];
  
  res.render('dashboard', { servers: servers });
});

router.use('/server', serverRouter);
router.use('/settings', settingsRouter);

module.exports = router;
