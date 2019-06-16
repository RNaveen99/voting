const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const passport = require('passport');
const uuid = require('uuid/v4');

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
app.use(cookieParser());
app.use(session({
    genid: (req) => {
        debug('Inside the session middleware');
        debug(req.sessionID);
        return uuid();
    },
    secret: 'voting',
    saveUninitialized: false,
    resave: false
}));
require('./src/config/passport.js')(app);


app.use(morgan('tiny'));

const resultRouter = require('./src/routes/resultRoutes')();
const voteRouter = require('./src/routes/voteRoutes')();
const authRouter = require('./src/routes/authRoutes')();

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

app.get('/', (req, res) => {
    res.render('home');
});
app.use('/results', resultRouter);
app.use('/vote', voteRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
    res.render('errorPage');
})