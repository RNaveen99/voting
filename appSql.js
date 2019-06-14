const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const sql = require('mssql');
//const uuid = require('uuid/v4');

const config = {
    //  systemctl status mysql.service
    //  /usr/bin/mysql -u root -p
    user: 'root',
    password: 'Naveen@123#',
    server: 'localhost\\3000', // You can use 'localhost\\instance' to connect to named instance
    database: 'test',
 
    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
}
//  this returns a promise
sql.connect(config).catch((err) => debug(err));

//  server created
const app = express();

//  listening for requests on port 3000
app.listen(3000, () => {
    debug('Server started');
});

//  set view engine or templating engine
app.set('view engine', 'ejs');
//  set the location of views directory
app.set('views', './src/views');

//  setting paths for static files such as css, js, jquery.
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(session({
    // genid: (req) => {
    //     debug('Inside the session middleware');
    //     debug(req.sessionID);
    //     return uuid();
    // },
    secret: 'voting',
    saveUninitialized: false,
    resave: false
}));

app.use(morgan('tiny'));
app.use((req, res, next) => {
    res.locals.data = req.session.data;
    next();
});

app.get('/', (req, res) => {
    //debug('Inside homepage calling function');
    //debug(req.sessionID);
    //res.send('You hit homepage\n');
    const request = new sql.request();
    request.query('Select * from books').then(result => {

    });

    res.render('voting');
    if (req.session.data) {
        req.session.destroy(() => { debug('Previous Session destroyed'); });
    }
    //debug(req.session);
}).post('/', (req, res) => {

    if (!req.session.data) {
        req.session.data = req.body;
        res.locals.data = req.session.data;
        let temp = [];
        res.locals.data.post.forEach(post => {
            let postName = post;
            let i = res.locals.data.post.indexOf(post);
            let obj = {};
            let c = [];
            obj.title = postName;
            res.locals.data.candidateName[i].forEach(candidate => {
                let j = res.locals.data.candidateName[i].indexOf(candidate);
                c.push({ cName: candidate, votes: 0 });
            });
            obj.candidates = c;
            temp.push(obj);
        });
        debug(temp);
        const url = 'mongodb://localhost:27017';
        const dbName = 'Voting';
        (async function addUser() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');

                const db = client.db(dbName);
                const col = db.collection(res.locals.data.electionName);
                const results = await col.insertMany(temp);
                const ssdd = await col.insertOne({title:'fsf'});
                debug(results);
            } catch (error) {
                debug(error);
            }
            client.close();
        }());
    } else if (req.session.data) {
        debug(req.body);
        (async function updateVotes() {
            let client;
            const url = 'mongodb://localhost:27017';
            const dbName = 'Voting';
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to server');

                const db = client.db(dbName);
                const col = db.collection(res.locals.data.electionName);
                
                res.locals.data.post.forEach(post => {
                    let postName = post;
                    let i = res.locals.data.post.indexOf(post);
                    
                    req.body.cName[i].forEach(element => {
                        let j = res.locals.data.candidateName[i].indexOf(element);
                        let t = "candidates." + j + ".votes";
                        let result = col.updateOne( {"candidates.cName":  "" + element }  ,   { $inc: { "candidates.$.votes" : 1 } } );
                        debug(result);
                    });
                    // let postName = post;
                    // let i = res.locals.data.post.indexOf(post);
                    // let obj = {};
                    // let c = [];
                    // obj.title = postName;
                    // res.locals.data.candidateName[i].forEach(candidate => {
                    //     let j = res.locals.data.candidateName[i].indexOf(candidate);
                    //     c.push({ cName: candidate, votes: 0 });
                    // });
                    // obj.candidates = c;
                    // temp.push(obj);
                });
            } catch (error) {
                debug(error);
            }
            client.close();
        }());
    }

    //res.setHeader('Content-Type', 'text/plain');
    res.render('vote');
});