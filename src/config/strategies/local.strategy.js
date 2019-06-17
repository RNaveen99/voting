const passport = require("passport");
const { Strategy } = require("passport-local");
const { MongoClient } = require("mongodb");
const { createConnection } = require("../../controllers/mongoController.js")();
const debug = require("debug")("app:local.strategy");

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: "username",
        passwordField: "password"
      },
      (username, password, done) => {
        (async function mongo() {
          let c;
          try {
            const { client, db } = await createConnection();
            c = client;
            debug("Connected correctly to database");

            const col = await db.collection("users");
            const user = await col.findOne({
              $or: [{ username }, { email: username }]
            });
            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } catch (error) {
            debug(error.stack);
          }
          c.close();
        })();
      }
    )
  );
};
