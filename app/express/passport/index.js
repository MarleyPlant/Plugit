var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var db = require('../pg');

// The place where you setup strategies.
// require("./keys");
// Require this in the main file(express.js) so that the strategies get setup.

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
