var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var config = require('./config.json')
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);


var app = express();
var db = new pg.Client({
  connectionString: config.connectionString,
  ssl: true,
});

passport.use('local-signin', new Strategy(
  {
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, cb) {
    db.query("SELECT *" +
           "FROM users " +
           "WHERE username=$1", [email], (err, res) => {
             user=res.rows[0]
             if (!bcrypt.compareSync(password, user.password)) { return cb(null, false); } //Check passwords
             return cb(null, user); //Return user
           })
  }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function signUp(username, password){
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash], (err, res) => {
    if(err) {console.log(err)}
  })
}

passport.serializeUser((user, done) => {
  done(null, user.userid);
});

passport.deserializeUser((id, cb) => {
  db.query("SELECT *" +
         "FROM users " +
         "WHERE userid=$1", [id], (err, res) => {
           user=res.rows[0]
           return cb(null, user); //Return user
         })
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
app.use( bodyParser.urlencoded({ extended: true }) );
app.use(session({
  store: new pgSession({
    pool : db
  }),
  secret: config.secret,
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
        console.log("Logged in")
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

db.connect() //Connect to database
  .then(() => console.log(`Successfully Connected To Database`))
  .catch(e => {
    console.error('Connection error', e.stack)
    process.exit()
  })

app.listen(app.get('port'));
console.log('Now listening on ' + app.get('port')); // To know when the server starts.
