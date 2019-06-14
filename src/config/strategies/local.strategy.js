const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
    passport.use(new Strategy( {
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        const url = 'mongodb://localhost:27017';
        const dbName = 'Voting';
        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url, { useNewUrlParser: true});
                debug('Connected correctly to database');

                const db = client.db(dbName);
                const col = db.collection('users');
                const user = await col.findOne( { $or: [ { username }, { email: username } ] } );
                if (user.password === password) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                debug(error.stack);
            }
            client.close();
        }());
    }));
}