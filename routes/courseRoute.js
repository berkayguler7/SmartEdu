const express = require('express');
const courseController = require('../controllers/courseController');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.route('/')
    .get(courseController.getAllCourses)
    .post(checkRole(["teacher", "admin"]), courseController.createCourse);

router.route('/:slug')
    .get(courseController.getCourse)

router.route('/enroll')
    .post(courseController.enrollCourse);

router.route('/release')
    .post(courseController.releaseCourse);

module.exports = router;
