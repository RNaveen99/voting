const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:voteRoutes");
const passport = require("passport");
const voteRouter = express.Router();
const { vote, voting } = require("../controllers/voteController.js")();
const router = () => {
  voteRouter
    .route("/")
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/signIn');
      }
    })
    .get(vote)
    .post(voting);

  return voteRouter;
}

module.exports = router;