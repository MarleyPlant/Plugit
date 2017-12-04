var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

app.set('port', (process.env.PORT || 5000));
app.engine('handlebars', handlebars.engine);
app.set('view engine', "handlebars");
app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res) {
  res.render('login', {title: 'Login'});
});

app.get('/404', function(req, res){
  res.render('404', {title: 'Crazy Shit!'});
});

app.listen(app.get('port'));

console.log('Now listening on ' + app.get('port')); // To know when the server starts.