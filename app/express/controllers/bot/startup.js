module.exports = function(app, midware, emitter) {
    app.get('/bot/startup', midware, function(req, res) {
        res.redirect('/dashboard');
        emitter.emit("start");
    });
}
