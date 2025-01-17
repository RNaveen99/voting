const debug = require('debug')('app:voteController');
const { extractElectionData } = require('./helpers/votingHelper')();
const { addElectionData, updateVotes, loadResults } = require('./helpers/mongo')();

const voteController = () => {
  const vote = (req, res) => {
    if (req.session.hasOwnProperty('data')) {
      req.session.destroy();
      return res.redirect('/auth/signIn');
    }
    res.render('vote');
  };

  const voting = async (req, res) => {
    if (!req.session.hasOwnProperty('data')) {
      const result = await loadResults(req.body.electionName);
      debug(result);
      debug(result.length);
      if (result.length !== 0) {
        debug('length == ', result.length);
        return res.redirect('/vote');
      }
      req.session.data = req.body;
      req.session.data.totalVoter = 0;
      const temp = extractElectionData(req.session.data);
      await addElectionData(req.session.data.electionName, temp, req.user._id);
    } else if (req.session.hasOwnProperty('data')) {
      try {
        //debug(req.body);
        req.session.data.totalVoter++;
        updateVotes(req.session.data, req);
      } catch (error) {
        debug('==============update Votes called==============');
        debug(error);
        debug('=========================================');
      }
    }
    res.render('voting', { data: req.session.data });
  };

  return {
    vote,
    voting,
  };
};

module.exports = voteController;
