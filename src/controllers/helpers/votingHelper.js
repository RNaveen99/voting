const debug = require('debug')('app:votingHelper');

const votingHelper = () => {

  const extractElectionData = (data) => {
    const temp = [];
    data.post.forEach((post) => {
      let i = data.post.indexOf(post);
      let c = [];
      data.candidateName[i].forEach((candidate) => {
        c.push({ cName: candidate, votes: 0 });
      });
      const obj = {};
      obj.title = post;
      obj.candidates = c;
      temp.push(obj);
    });
    debug('==========temp===================');
    debug(temp);
    debug('==========temp===================');
    
    return temp;
  }

  return {
    extractElectionData,
  };
};

module.exports = votingHelper;
