const express = require('express');
const authController = require('../controllers/authController');
const checkAuth = require('../middleware/checkAuth');
const { body } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post(
    [
        body('name').not().isEmpty().withMessage(' Please enter your name'),
        body('email').isEmail().withMessage('Please enter an e-mail address.').custom((userEmail) => {
                return User.findOne({ email: userEmail }).then((user) => {
                    if (user) {
                        return Promise.reject(' Email is already in use');
                    }
                });
            }),
        body('password').not().isEmpty().withMessage(' Please enter a password'),
    ],

    authController.createUser
);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(checkAuth, authController.getDashboardPage);
router.route('/:id').delete(authController.deleteUser);

module.exports = router;
