const { addUser, findUser } = require('../controllers/helpers/mongo')();

const authController = () => {

  const signUpPost = async (req, res) => {
    const { name, username, email, password } = req.body;
    const elections = [];
    const userAccount = { name, username, email, password, elections };
    (async function signUp() {
      let results = await findUser(username, email);
      if (!results) {
        results = await addUser(userAccount);
        req.login(results.ops[0], () => {
          return res.redirect('/auth/profile');
        });
      } else {
        res.redirect('/auth/signIn');
      }
    }());
  }
  return {
    signUpPost,
  }
}

module.exports = authController;