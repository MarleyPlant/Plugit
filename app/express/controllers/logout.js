module.exports = function(app, midware) {
    app.get('/logout', midware, (req,res) => {
        req.session.destroy(function (err) {
           res.redirect('/'); //Inside a callback… bulletproof!
        });
    });
}
