const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:mongoHelper');

const mongoHelper = () => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'voting';

  const createConnection = async () => {
    debug('request for connection sent');
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    debug('request for connection accepted');
    return { client, db };
  };

  const addElectionData = async (electionName, temp, userId) => {
    let c;
    try {
      const { client, db } = await createConnection();
      c = client;
      const col1 = db.collection(electionName);
      const result1 = await col1.insertMany(temp);
      const col2 = db.collection('users');
      const result2 = await col2.updateOne(
        { _id: new ObjectID(userId) },
        { $push: { elections: electionName } },
      );
    } catch (error) {}
    c.close();
  }
  const updateVotes = async (data, req) => {
    let c;
    try {
      const { client, db } = await createConnection();
      c = client;
      const col = db.collection(data.electionName);
  
      //  await updateEachPost(data);
      for (const post of data.post) {
        await updateEachPost(data, req, col, post);
      }
    } catch (error) {}
    c.close();
  }
  const updateEachPost = async (data, req, col, post) => {
    try {
      const i = data.post.indexOf(post);
      for (const element of req.body.cName[i]) {
        let result = await col.updateOne(
          { title: post , 'candidates.cName': element },
          { $inc: { 'candidates.$.votes': 1 } },
        );
        debug('--------------update each post--------------');
        //debug(result);
        debug('--------------update each post--------------');
      }
    } catch (error) {}
  }
  
  const loadResults = async (ename) => {
    let c;
    let result;
    try {
      const { client, db } = await createConnection();
      c = client;
      const col = await db.collection(ename);
      debug(ename);
      result = await col.find({}, { projection: { title: 1, candidates: 1, _id: 0 } }).toArray();
      debug(data);
    } catch (error) {}
    c.close();
    return result;
  }

  const addUser = async (userAccount) => {
    let c;
    let result;
    try {
      const { client, db } = await createConnection();
      c =  client;
      const col = await db.collection('users');
      result = await col.insertOne(userAccount);
    } catch (error) {}
    c.close();
    return result;
  }
  const findUser = async (username, email) => {
    let c;
    let result;
    try {
      const { client, db } = await createConnection();
      c = client;
      const col = await db.collection('users');
      result = await col.findOne({
        $or: [{ username }, { email }]
      });
    } catch (error) {}
    c.close();
    return result;
  }
  return {
    addElectionData,
    updateVotes,
    loadResults,
    addUser,
    findUser,
  };
};

module.exports = mongoHelper;
