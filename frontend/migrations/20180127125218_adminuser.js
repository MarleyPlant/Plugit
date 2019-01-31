var bcrypt = require('bcryptjs');
var username = "admin"
var password = "admin"


exports.up = function(knex, Promise) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);

  return knex('users')
  .insert({
    username: username,
    password: hash
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
      t.dropColumn("admin");
  });
};
