module.exports = function (app, passport) {
    app.post('/login', (req, res, next) => {
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
}