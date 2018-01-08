module.exports = function(app, midware, emitter) {
    app.get('/shutdown', midware, function(req, res) {
        res.redirect('/dashboard');
        emitter.emit("shutdown");
    });
}