var express = require('express');
    exphbs = require("express-handlebars");

var app = express();


app.set('port', (process.env.PORT || 5000));
app.engine('handlebars', exphbs());
app.set('view engine', "handlebars");
app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res) {
  res.render('login', {layout: false});
});

app.listen(app.get('port'))
