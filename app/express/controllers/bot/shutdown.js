var router = require('express').Router();
var midware = require('../../middleware').isLoggedIn

router.get('/', midware, function(req, res) {
    var emitter = req.app.get('emitter');
    res.redirect('/dashboard');
    emitter.emit("shutdown");
});

module.exports = router;
