const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router() {
    authRouter.route('/signUp')
        .all((req, res, next) => {
            if (! req.user) {
                next();
            } else {
                res.redirect('/auth/profile');
            }
        })
        .get((req, res) => {
            //res.write('ok');
            res.render('signUp');
        })
        .post((req, res) => {
            const { name, username, email, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'Voting';
            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(url, { useNewUrlParser: true });
                    debug('Connected correctly to server');
                    
                    const db = client.db(dbName);
                    const col = db.collection('users');
                    const userAccount = { name, username, email, password };
                    const results = await col.insertOne(userAccount);
                    //debug(results);
                    req.login(results.ops[0], () => {
                        res.redirect('/auth/profile');
                    });
                } catch(error) {
                    debug(error);
                }
                client.close();
            }());
        });
        
        authRouter.route('/signIn')
            .get((req, res) => {
                res.render('signIn');
            })
            .post(passport.authenticate('local', {
                successRedirect: '/auth/profile',
                failureRedirect: '/auth/signin'
            }));

        authRouter.route('/profile')
            .all((req, res, next) => {
                if (req.user) {
                    next();
                } else {
                    res.redirect('/auth/signIn');
                }
            })
            .get((req, res) => {
                let data = req.user;
                res.render('profile' ,{ data });
            });

        return authRouter;
}

module.exports = router;