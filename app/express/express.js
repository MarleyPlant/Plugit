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

// Requiring server middleware modules.
var isLoggedIn = require('./middleware/isLoggedIn');

// Requiring server request handling modules.
var shutdownController = require('./controllers/shutdown');
var startupController = require('./controllers/startup');
var logoutController = require('./controllers/logout');
var loginController = require('./controllers/login');
var dashboardController = require('./controllers/dashboard');

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

var discord = {
  messages: 296,
  commands: 100
};

app.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.redirect('/dashboard')
    return
  }
  res.render('login', {title: 'Login'});
});

shutdownController(app, isLoggedIn, emitter);
startupController(app, isLoggedIn, emitter);
logoutController(app, isLoggedIn);
loginController(app, passport);
dashboardController(app, isLoggedIn, discord);

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
