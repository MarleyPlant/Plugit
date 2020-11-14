var express = require("express");
var router = express.Router();
var passport = require("passport");
var isAuth = require("../helpers/isAuth");
const knex = require("knex")(require("../knexfile").development);

router.post("/update/", (req, res) => {
  // Update Items In Database.
  knex("settings").first().update(req.body).then((data) => {
    res.redirect("/settings");
  }).catch((err) => {
    console.log(err);
  });
});

router.get('/restart', function (req,res,next) {
  console.log("This is pid " + process.pid);
  setTimeout(function () {
      process.on("exit", function () {
          require("child_process").spawn(process.argv.shift(), process.argv, {
              cwd: process.cwd(),
              detached : true,
              stdio: "inherit"
          });
      });
      process.exit();
  }, 5000);
});

router.get("/", function (req, res, next) {
  knex("settings")
    .first()
    .then(async (data) => {
      var token = data["token"];
      var prefix = data["prefix"];
      var clientid = data['clientid'];
      var clientsecret = data['clientsecret'] || process.env.CLIENT_SECRET;

      res.render("settings", {
        title: "Plugit - Settings",
        token: token,
        prefix: prefix,
        clientid: clientid,
        clientsecret: clientsecret,
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
