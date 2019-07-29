const debug = require('debug')('app:restrictions');

const restrictions = () => {
  const ifSignIn = (req, res, next) => {
    if (!req.user) {
      return res.redirect('/auth/signIn');
    }
    next();
  };

  const ifNotSignIn = (req, res, next) => {
    if (req.user) {
      return res.redirect('/auth/profile');
    }
    next();
  };

  return {
    ifSignIn,
    ifNotSignIn,
  };
};

module.exports = restrictions;
