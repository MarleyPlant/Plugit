var express = require("express");
var router = express.Router();
var passport = require("passport");
var isAuth = require("../helpers/isAuth");
const knex = require("knex")(require("../knexfile").development);

router.get("/update/token/:token", (req, res) => {
  // Update Items In Database.
  var token = req.params.token;
  knex("settings").first().update({ token: token }).then((data) => {
    res.redirect("/settings");
  });
});


var scripts = {
  update: () => {
    console.log("UPDATE");
  }
};

router.get("/", function (req, res, next) {
  knex("settings")
    .first()
    .then(async (data) => {
      var token = data["token"];
      var prefix = data["prefix"];
      res.render("settings", {
        utils: scripts,
        title: "Plugit - Settings",
        token: token,
        prefix: prefix,
        settings: [
          {
            id: 1,
            icon: "cog",
            name: "General Settings",
            active: true,
          },
          {
            id: 2,
            icon: "globe",
            name: "Connection Settings",
          },
          {
            id: 3,
            icon: "plug",
            name: "Plugin Manager",
          },
        ],
        tabid: 1,
      });
    });
});
module.exports = router;
