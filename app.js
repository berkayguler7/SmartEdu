const express = require('express');
require('dotenv').config();
//const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

app.get('/', (req, res) => {
    res.status(200).render('index', {
        page_name: 'index'
    });
})

app.get('/about', (req, res) => {
    res.status(200).render('about', {
        page_name: 'about'
    });
})

app.get('/courses', (req, res) => {
    res.status(200).render('courses', {
        page_name: 'courses'
    });
})

app.get('/dashboard', (req, res) => {
    res.status(200).render('dashboard', {
        page_name: 'dashboard'
    });
})

app.get('/contact', (req, res) => {
    res.status(200).render('contact', {
        page_name: 'contact'
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port: ${process.env.PORT}`);
})