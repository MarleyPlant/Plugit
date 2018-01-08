module.exports = function(app, midware, emitter) {
    app.get('/startup', isLoggedIn, function(req, res) {
        res.redirect('/dashboard');
        emitter.emit("start");
    });
}