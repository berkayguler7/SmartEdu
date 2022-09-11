const express = require('express');
const pageController = require('../controllers/pageController');
const checkSession = require('../middleware/checkSession');

const router = express.Router();

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/register').get(checkSession, pageController.getRegisterPage);
router.route('/login').get(checkSession, pageController.getLoginPage);
router.route('/contact')
    .get(pageController.getContactPage)
    .post(pageController.sendEmail);

module.exports = router;
