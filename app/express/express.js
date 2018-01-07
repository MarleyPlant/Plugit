var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);
var passport = require('passport');
var events = require('events');
var emitter = new events.EventEmitter();
var app = express();
var pg = require('./pg/index')
require('./passport/index')

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

var hbs = require('express-handlebars').create({
  defaultLayout: 'main',
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
});

app.set('port', (process.env.PORT || 5000));
app.engine('hbs', hbs.engine);
app.set('view engine', "hbs");
app.set('views', __dirname + '/views');
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(session({
  store: new pgSession({
    pool : pg
  }),
  secret: process.env.secret,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(express.static(__dirname + '/www'));
app.use(passport.initialize());
app.use(passport.session());

app.get('/shutdown', isLoggedIn, function(req, res) {
  res.redirect('/dashboard');
  emitter.emit("shutdown");
});


app.get('/startup', isLoggedIn, function(req, res) {
  res.redirect('/dashboard');
  emitter.emit("start");
})

app.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.redirect('/dashboard')
    return
  }
  res.render('login', {title: 'Login'});
});

app.get('/logout', isLoggedIn, (req,res) => {
  req.session.destroy(function (err) {
     res.redirect('/'); //Inside a callback… bulletproof!
   });
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local-signin', (err, user, info) => {
    if (err) { console.log(err); return}
    if (!user) { console.log("User not found"); return}
    if (user) {
      req.logIn(user, function (err) {
        if (err) { console.log(err); return}
        return res.redirect('/dashboard')
      });
    }
  })(req, res, next);
});

var discord = {
  messages: 296,
  commands: 100
}
app.get('/dashboard',isLoggedIn, function(req, res) {
  res.render('dashboard', {title: 'dashboard', user: req.user, discord: discord});
});

app.use(function (req, res, next) {
  res.status(404).render('404', {title: 'Crazy Shit!'});
}) //Keep this at bottom of file

pg.connect() //Connect to database
  .catch(e => {
    console.error('Connection error', e.stack)
    process.exit()
  })

app.listen(app.get('port'));
console.log('Now listening on ' + app.get('port')); // To know when the server starts.
module.exports = emitter
