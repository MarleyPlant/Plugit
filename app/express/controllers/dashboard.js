module.exports = function(app, midware, discordObj) {
    app.get('/dashboard', midware, function(req, res) {
        res.render('dashboard', {title: 'dashboard', user: req.user, discord: discordObj});
    });
}