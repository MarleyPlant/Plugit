module.exports = function(app, midware, emitter) {
    app.get('/startup', midware, function(req, res) {
        res.redirect('/dashboard');
        emitter.emit("start");
    });
}
