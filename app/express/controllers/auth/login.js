var router = require('express').Router();

router.post('/', (req, res, next) => {
    var passport = req.app.get('passport');
    passport.authenticate('local-signin', (err, user, info) => {
        if (err) { console.log(err); return}
        if (!user) { console.log("User not found"); return}
        if (user) {
            req.logIn(user, function (err) {
                if (err) { console.log(err); return}
                return res.redirect('/dashboard');
            });
        }
    })(req, res, next);
});


module.exports = router;
