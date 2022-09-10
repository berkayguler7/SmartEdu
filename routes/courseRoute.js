const express = require('express');
const courseController = require('../controllers/courseController');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.route('/')
    .get(courseController.getAllCourses)
    router.route('/').post(checkRole(["teacher", "admin"]), courseController.createCourse);

router.route('/:slug')
    .get(courseController.getCourse)

module.exports = router;
