const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const ejs = require('ejs');

const app = express();

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//GLOBAL VARIABLES
global.userIN = null;

//MIDDLEWARES
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
})
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);


// Logger
app.use((req, res, next) => {
    userIN = req.session.userID;
    console.table({
        request: {
            METHOD: req.method,
            URL: req.url,
            IP: req.ip,
            USER_ID: req.session.userID,
            SESSION_ID: req.sessionID,
            ROLE: req.session.userRole,
        },
    });
    next();
});

//ROUTES
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB Connected!');
        app.listen(process.env.PORT, () => {
            console.log(`Server is live on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
