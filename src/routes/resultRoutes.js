const express = require('express');
const debug = require('debug')('app:resultRoutes');
const { ifSignIn } = require('../controllers/helpers/restrictions')();
const { loadResults } = require('../controllers/helpers/mongo')();

const resultRouter = express.Router();

function router() {
  resultRouter
    .route('/')
    .all(ifSignIn)
    .get((req, res) => {
      const { elections } = req.user;
      res.render('results', { elections });
    })
    .post((req, res) => {
      const { ename } = req.body;
      (async function results() {
        const result = await loadResults(ename);
        res.render('electionResults', { result });
      }());
    });

  return resultRouter;
}

module.exports = router;
