var express = require('express');
var app = express();
var pg = require('pg');
var config = require('./config.json')
var db = new pg.Client({
  connectionString: config.connectionString,
  ssl: true,
});

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
app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res) {
  res.render('login', {title: 'Login'});
});

app.get('/dashboard', function(req, res) {
  res.render('dashboard', {title: 'dashboard'});
});

app.get('/404', function(req, res){
  res.render('404', {title: 'Crazy Shit!'});
});


db.connect() //Connect to database
  .then(() => console.log(`Successfully Connected To Database`))
  .catch(e => {
    console.error('Connection error', e.stack)
    process.exit()
  })

app.listen(app.get('port'));

console.log('Now listening on ' + app.get('port')); // To know when the server starts.
