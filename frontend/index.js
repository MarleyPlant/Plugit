var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var session = require('express-session');
var passport = require('passport');
var events = require('events');

// Allow use of .env in a development enviroment
try {
  require('dotenv').config()
} //If not in heroku enviroment then allow access to env veriable
catch (e) {

}


// initialize app
var emitter = new events.EventEmitter();
var app = express();
var knex = require('knex')(require('./knexfile'))
require('./passport')(knex, passport)

// Requiring server middleware modules.
var middleware = require('./middleware');

// initialize express-handlebars
var hbs = require('express-handlebars').create({
  defaultLayout: 'main',
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
});

// Setup express
app.set('port', (process.env.PORT || 8080));
app.engine('hbs', hbs.engine);
app.set('view engine', "hbs");
app.set('views', __dirname + '/views');
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(session({
  secret: process.env.secret || "lfenajifiahfwiohuejofjncdhzbsfiojsfeiouhjerofinrwoej",
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(express.static(__dirname + '/www'));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  if (req.isAuthenticated()){
    res.redirect('/dashboard')
    return
  }
  res.render('login', {title: 'Login'});
});

// Use Controllers
app.use(require('./controllers'));


app.use(function (req, res, next) {
  res.status(404).render('404', {title: 'Crazy Shit!'});
}) //Keep this at bottom of file

app.listen(app.get('port'));
console.log('Now listening on ' + app.get('port')); // To know when the server starts.


app.set('passport', passport);
app.set('knex', knex);
app.set('emitter', emitter)
module.exports = emitter
module.exports.knex = knex
