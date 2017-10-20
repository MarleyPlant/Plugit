const util = require("plugit-util");

module.exports = {
  events: {
    ready: {
      main: function(bot, db) {
        db.query("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)");
      }
    },
    message: {
      main: function(bot, db, msg) {
          //Add XP
      }
    }
  }
}
