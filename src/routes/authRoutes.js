const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:authRoutes");
const passport = require("passport");
const authRouter = express.Router();
const { createConnection } = require("../controllers/mongoController.js")();

const router = () => {
  authRouter
    .route("/signUp")
    .all((req, res, next) => {
      if (!req.user) {
        next();
      } else {
        res.redirect("/auth/profile");
      }
    })
    .get((req, res) => {
      res.render("signUp");
    })
    .post((req, res) => {
      const { name, username, email, password } = req.body;
      const elections = [];
      (async function signIn() {
        let c;
        try {
          let { client, db } = await createConnection();
          c = client;
          debug("Connected correctly to server");
          const col = db.collection("users");
          const userAccount = { name, username, email, password, elections };
          const results = await col.insertOne(userAccount);
          //debug(results);
          req.login(results.ops[0], () => {
            res.redirect("/auth/profile");
          });
        } catch (error) {
          debug(error);
        }
        c.close();
      })();
    });

  authRouter
    .route("/signIn")
    .all((req, res, next) => {
      if (!req.user) {
        next();
      } else {
        res.redirect("/auth/profile");
      }
    })
    .get((req, res) => {
      res.render("signIn");
    })
    .post(
      passport.authenticate("local", {
        successRedirect: "/auth/profile",
        failureRedirect: "/auth/signin"
      })
    );

  authRouter
    .route("/profile")
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect("/auth/signIn");
      }
    })
    .get((req, res) => {
      let user = req.user;
      res.render("profile", { user });
    });

  authRouter.route("/signOut").get((req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect("/auth/signIn");
  });
  
  return authRouter;
};

module.exports = router;
