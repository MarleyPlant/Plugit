var express = require('express');
var router = express.Router();
var passport = require('passport');
var isAuth = require('../helpers/isAuth');


router.get('/', function(req, res, next) {
res.render('settings', {
    title: 'Plugit - Settings',
    settings: [
        {
            id: 1
            icon: "cog",
            name: 'General Settings',
            active: true 
        },
        {
            id: 2
            icon: 'globe',
            name: 'Connection Settings'
        },
        {
            id: 3
            icon: 'plug',
            name: 'Plugin Manager'
        },
    ],
    tabid: 1
});
});

module.exports = router;
