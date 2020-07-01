const DiscordStrategy = require('passport-discord').Strategy;
const tableNames = require('../constants/tableNames');
const passport = require('passport');
const knex = require('knex')(require('../knexfile').development);

passport.use(new DiscordStrategy({
    clientID: '355715029296742403',
    clientSecret: 'HvMRdrUlAHulfRL8JO-DEFvdErhCw17M',
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    knex.select("discord_ID")
    .from(tableNames.user)
    .where("discord_ID", profile.id)
    .then(function(user) {
        console.log(user);
    })
    .catch(function(error) {
        console.error(error);
    });
}));