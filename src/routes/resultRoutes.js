const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:resultRoutes");
const passport = require("passport");

const resultRouter = express.Router();

function router() {
  resultRouter
    .route("/")
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect("/auth/signIn");
      }
    })
    .get((req, res) => {
      res.render("results",);
    });

  return resultRouter;
}

module.exports = router;
