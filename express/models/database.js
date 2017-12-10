const pg = require('pg');
const config = require('../config.json')
//const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
const client = new pg.Client({
  connectionString: config.connectionString,
  ssl: true,
});

client.connect();

client.query('CREATE table session(sid VARCHAR not null collate "default", sess json not null, expire timestamp(6) not null) WITH (OIDS=FALSE)', (err, res) => {
  if(err) {
    console.log(err)
  }
})
client.query('ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY(sid) NOT DEFERRABLE INITIALLY IMMEDIATE', (err,res) => {
  if(err) {
    console.log(err)
  }
})
const res = client.query(
  'CREATE TABLE users(userid SERIAL PRIMARY KEY, username VARCHAR(50) not null, password VARCHAR(200) not null)', (err, res) => {
    if(err) {
      console.log(err)
    }
    else {
      console.log("Table Created")
    }
    client.end()
  })
