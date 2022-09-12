const User = require('../models/User');
const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        console.log(user);

        res.status(201).redirect('/login');
    } catch (e) {
        const errors = validationResult(req);
        console.log(errors);
        console.log(errors.array()[0].msg);

        for (let i = 0; i < errors.array().length; i++) {
            req.flash('error', `${errors.array()[i].msg}`);
        }

        res.status(400).redirect('/register');
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            bcrypt.compare(password, user.password, (err, same) => {
                if (same) {
                    //console.table({loggedin: {Username: user.name, EMail: user.email, Role: user.role}});
                    req.session.userID = user._id;
                    req.session.userRole = user.role;
                    res.redirect('/users/dashboard');
                } else {
                    req.flash('error', 'Incorrect password.');
                    res.status(400).redirect('/login');
                }
            });
        } else {
            req.flash('error', 'User does not exist.');
            res.status(400).redirect('/login');
        }
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userID }).populate(
        'courses'
    );
    const categories = await Category.find().sort('name');
    const courses = await Course.find({ creator: req.session.userID });
    res.status(200).render('dashboard', {
        page_name: 'dashboard',
        categories,
        user,
        courses,
    });
};
