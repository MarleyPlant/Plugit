const pg = require('pg');
const bcrypt = require('bcryptjs');
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();

client.query("CREATE TABLE session(sid VARCHAR NOT NULL, sess JSON NOT NULL, expire TIMESTAMP NOT NULL)", (err, res) => {
  if(err) {
    console.log(err)
  }
  else {
    console.log("Created Sessions Table")
  }
}) //Create Session Table

client.query("ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid)") //Alter Session Table

const res = client.query(
  'CREATE TABLE users(userid SERIAL PRIMARY KEY, username VARCHAR(50) not null, password VARCHAR(200) not null)', (err, res) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log("Created Users Table")
    }
}) //Create Users Table

function signUp(username, password){
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(password, salt);
  client.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hash], (err, res) => {
    if(err) {console.log(err)}
  })
}

signUp("admin@admin.com", "admin");


client.end()
