const debug = require("debug")("app:voteController");
const { createConnection } = require("../controllers/mongoController.js")();
const { MongoClient, ObjectID } = require("mongodb");

const voteController = () => {
  const vote = (req, res) => {
    if (req.session.hasOwnProperty("data")) {
      delete req.session["data"];
      req.session.save();
      req.session.destroy();
      res.redirect('/auth/signIn');
    }
    res.render("vote");
  };

  const voting = (req, res) => {
    let data;
    if (!req.session.hasOwnProperty("data")) {
      req.session.data = req.body;
      data = req.session.data;

      let temp = extractElectionData(data);
      addElectionData(data.electionName, temp, req.user._id);
    } else if (req.session.hasOwnProperty("data")) {
      data = req.session.data;
      debug(req.body);
      updateVotes(data, req);
    }
    res.render("voting", { data });
  };

  return {
    vote,
    voting
  };
};

module.exports = voteController;

function extractElectionData(data) {
  let temp = [];
  data.post.forEach(post => {
    let postName = post;
    let i = data.post.indexOf(post);
    let obj = {};
    let c = [];
    obj.title = postName;
    data.candidateName[i].forEach(candidate => {
      let j = data.candidateName[i].indexOf(candidate);
      c.push({ cName: candidate, votes: 0 });
    });
    obj.candidates = c;
    temp.push(obj);
  });
  return temp;
}

async function addElectionData(electionName, temp, userId) {
  let c;
  try {
    const { client, db } = await createConnection();
    c = client;
    const col1 = db.collection(electionName);
    const result1 = await col1.insertMany(temp);
    const col2 = db.collection("users");
    const result2 = await col2.updateOne(
      { _id: new ObjectID(userId) },
      { $push: { elections: electionName } }
    );
  } catch (error) {}
  c.close();
}

async function updateVotes(data, req) {
  let c;
  try {
    const { client, db } = await createConnection();
    c = client;
    const col = db.collection(data.electionName);

    //await updateEachPost(data);
    for (const post of data.post) {
      let i = data.post.indexOf(post);
      await updateEachPost(data, req, i, client, db, col, post);
      // debug('--------------update votes--------------');
      // debug(result);
      // debug('--------------update votes--------------');
    }
  } catch (error) {}
  c.close();
}
async function updateEachPost(data, req, i, client, db, col, post) {
  try {
    for (const element of req.body.cName[i]) {
      let result = await col.updateOne(
        { $and: [{ title: post }, { "candidates.cName": element }] },
        { $inc: { "candidates.$.votes": 1 } }
      );
      debug("--------------update each post--------------");
      //debug(result);
      debug("--------------update each post--------------");
    }
  } catch (error) {}
}
