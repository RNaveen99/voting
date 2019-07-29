const express = require('express');
const debug = require('debug')('app:voteRoutes');
const { vote, voting } = require('../controllers/voteController.js')();
const { ifSignIn } = require('../controllers/helpers/restrictions')();

const voteRouter = express.Router();

const router = () => {
  voteRouter
    .route('/')
    .all(ifSignIn)
    .get(vote)
    .post(voting);

  return voteRouter;
}

module.exports = router;