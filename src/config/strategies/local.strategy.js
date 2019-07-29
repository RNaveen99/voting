const passport = require('passport');
const { Strategy } = require('passport-local');
const { findUser } = require('../../controllers/helpers/mongo')();
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      (username, password, done) => {
        (async function mongo() {
          const user = await findUser(username, username);
          if (user) {
            if (user.password === password) {
              done(null, user);
            } else {
              done(null, false);
            }
          } else {
            done(null, false);
          }
        }());
      }
    )
  );
};
