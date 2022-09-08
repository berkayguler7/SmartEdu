const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const ejs = require('ejs');

const app = express();

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//MIDDLEWARES
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    methodOverride('_method', {
        methods: ['POST', 'GET'],
    })
);
app.use('/', pageRoute);
app.use('/courses', courseRoute);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB CONNECTED!');
        app.listen(process.env.PORT, () => {
            console.log(`Server is live on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
