const express = require("express");
const { MongoClient } = require("mongodb");
const { createConnection } = require("../controllers/mongoController.js")();
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
      let data = req.user.elections;
      res.render("results", { data });
    })
    .post((req, res) => {
      let ename = req.body.ename;
      loaddata(res, ename);
    });

  return resultRouter;
}

module.exports = router;

async function loaddata(res, ename) {
  let c, data;
  try {
    const { client, db } = await createConnection();
    c = client;
    const col = await db.collection(ename);
    debug(ename);
    data = await col.find({}, { title: 1, candidates: 1, _id: 0 }).toArray();
    res.render("electionResults", { data });
    debug(data);
  } catch (error) {}
  c.close();
}
