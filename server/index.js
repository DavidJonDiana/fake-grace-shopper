require('dotenv').config()
const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db/models').db;
const User = require('./db/models').User;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({db: db});
dbStore.sync();
const app = express();
const passport = require('passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(volleyball);

//session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: dbStore
}))

//passport auth
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    try {
        done(null, user.id);
    } catch (err) {
        done(err);
    }
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(done);
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', require('./api'));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


app.use(function (err, req, res, next) {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

const port = process.env.PORT; 
db.sync()
.then(() => {
    app.listen(port, function () {
        console.log(`Your server, listening on port ${port}`);
    });
})






