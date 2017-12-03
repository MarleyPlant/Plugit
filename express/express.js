var express = require('express');

app.set('port', (process.env.port || 5000));

app.use(express.static(__dirname + '/www'));
