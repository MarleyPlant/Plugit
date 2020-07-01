const DiscordStrategy = require('passport-discord').Strategy;
const tableNames = require('../constants/tableNames');
const passport = require('passport');
const knex = require('knex')(require('../knexfile').development);

passport.serializeUser((user, done) => {
    console.log("Serialize");
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    console.log("De Serialize");
    knex('users').where({discord_ID: user.discord_ID}).first()
        .then((user) => { done(null, user); })
        .catch((err) => { done(err,null); });
});

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

passport.use(new DiscordStrategy({
    clientID: '355715029296742403',
    clientSecret: 'HvMRdrUlAHulfRL8JO-DEFvdErhCw17M',
    callbackURL: process.env.CLIENT_REDIRECT,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    knex(tableNames.user).where({ discord_ID: profile.id }).first()
    .then((user) => { 
        if(!user) {
            var newuser = knex(tableNames.user).insert({ discord_ID: profile.id, name: profile.username }).catch(function(e) {
                done(false,e);
            });
            return done(null, newuser);
        }
        done(null, user); 
    })
    .catch((err) => { console.log(err); });
}));