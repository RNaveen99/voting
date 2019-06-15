const { MongoClient } = require("mongodb");
const debug = require("debug")("app:mongoController");

const mongoController = () => {
  const url = "mongodb://localhost:27017";
  const dbName = "Voting";

  const createConnection = async () => {
    debug("request for connection sent");
    let client = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db(dbName);
    debug("request for connection accepted");
    return { client, db };
  };

  return {
    createConnection
  };
};

module.exports = mongoController;
