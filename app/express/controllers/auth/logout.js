var router = require('express').Router();
var midware = require('../../middleware').isLoggedIn


router.get('/', midware, (req,res) => {
    req.session.destroy(function (err) {
       res.redirect('/'); //Inside a callback… bulletproof!
    });
});

module.exports = router;
