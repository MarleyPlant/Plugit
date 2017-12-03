var express = require('express');
    http = require("http");
var app = express();


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/www'));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port Number: " + app.get('port'));
});
