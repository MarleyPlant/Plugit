var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

module.exports = function(knex, passport) {
  // The place where you setup strategies.
  // require("./keys");
  // Require this in the main file(express.js) so that the strategies get setup.

  passport.use('local-signin', new Strategy(
    {
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, cb) {
      knex('users').where({ username }).first()
      .then((user) => {
        if (!user) return cb(null, false);
        if (!bcrypt.compareSync(password, user.password)) {
          return cb(null, false);
        } else {
          return cb(null, user);
        }
      })
      .catch((err) => { return cb(err); });
    }));


    function signUp(username, password){
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      knex('users')
      .insert({
        username: username,
        password: hash
      })
    }

    passport.serializeUser((user, cb) => {
      cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
      knex('users').where({id}).first()
          .then((user) => { cb(null, user); })
          .catch((err) => { cb(err,null); });
    });
};
