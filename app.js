var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var knex = require('knex')(require('./knexfile').development);
var discordStrategy = require('./passport/discord');
var indexRouter = require('./routes/index');
var settingsRouter = require('./routes/settings');
var serverRouter = require('./routes/server');

var authRouter = require('./routes/auth');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 60000 * 60 * 24
  },
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/server', serverRouter);
app.use('/settings', settingsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
