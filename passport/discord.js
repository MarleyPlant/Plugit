const knex = require("knex")(require("../knexfile").development);
let clientid;
let clientsecret;

knex("settings")
  .then(async (data) => {
    clientid = data["clientid"];
    clientsecret = data["clientsecret"];
  })
  .catch((err) => console.log(err));

const DiscordStrategy = require("passport-discord").Strategy;
const { Client, Permissions } = require("discord.js");
const tableNames = require("../constants/tableNames");
const passport = require("passport");
const { json } = require("express");
const isEmpty = require("../helpers/isEmpty");
const client = new Client();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  knex("users")
    .where({ discord_ID: user.discord_ID })
    .first()
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

function get_guilds(profile) {
  var guildsToDB = [];
  for (let guild of profile.guilds) {
    // Check If The User Has All Permissions On The Server
    const permissions = new Permissions(guild.permissions);

    if (permissions.has("ADMINISTRATOR")) {
      guildsToDB.push(guild.id);
    }
  }

  return JSON.stringify(guildsToDB);
}

passport.use(
  new DiscordStrategy(
    {
      clientID: clientid || process.env.CLIENT_ID,
      clientSecret: clientsecret || process.env.CLIENT_SECRET,
      callbackURL: process.env.CLIENT_REDIRECT || '/auth/redirect',
      scope: ["identify", "guilds"],
    },
    (accessToken, refreshToken, profile, done) => {
      knex(tableNames.user)
        .where({ discord_ID: profile.id })
        .first()
        .then((user) => {
          if (!user) {
            console.log(`Creating user for ${profile.id}`);
            knex(tableNames.user)
              .insert({
                discord_ID: profile.id,
                name: profile.username,
                guilds: get_guilds(profile),
              })
              .then((user) => {
                knex(tableNames.user)
                  .where({ id: user[0] })
                  .first()
                  .then((user) => {
                    return done(null, user);
                  })
                  .catch(function (e) {
                    console.log(`50: ${e}`);
                    return done(false, e);
                  });
              })
              .catch(function (e) {
                console.log(e);
                return done(false, e);
              });
          } else {
            console.log(`User ${user} exists`);
            knex(tableNames.server)
              .where({ discord_ID: profile.id })
              .update({ guilds: get_guilds(profile) }, ["id", "guilds"])
              .catch(function (e) {
                done(false, e);
              });

            done(null, user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  )
);
