const Course = require('../models/Course');
const Category = require('../models/Category');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
    try {
        await Course.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            creator: req.session.userID,
        });
        req.flash('success', 'Course created successfully.');
        res.status(201).redirect('/courses');
    } catch (error) {
        req.flash('error', 'An error has occured.');
        res.status(400).redirect('/courses');
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const categorySlug = req.query.category;
        const query = req.query.search;
        const category = await Category.findOne({ slug: categorySlug });

        let filter = {};

        if (categorySlug) {
            filter = { category: category._id };
        }

        if (query) {
            filter = { name: query };
        }

        if (!query && !categorySlug) {
            filter.name = '';
            filter.category = null;
        }

        const courses = await Course.find({
            $or: [
                { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
                { category: filter.category },
            ],
        }).sort('-createdAt');

        const categories = await Category.find();

        res.status(200).render('courses', {
            courses,
            categories,
            page_name: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ slug: req.params.slug }).populate(
            'creator'
        );
        const user = await User.findById(req.session.userID);

        res.status(200).render('course', {
            user,
            course,
            page_name: 'courses',
        });
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};

exports.enrollCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.push({ _id: req.body.course_id });
        await user.save();

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};

exports.releaseCourse = async (req, res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.pull({ _id: req.body.course_id });
        await user.save();

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndRemove({ slug: req.params.slug });
        if(!course) return res.status(404).json({ status: 'fail', message: 'Course not found.' });
        if(req.session.userID !== course.creator.toString()) return res.status(401).json({ status: 'fail', message: 'Unauthorized.' });
        req.flash('success', `${course.name} deleted successfully.`);

        // Very dubious way of removing course from users' courses array
        const users = await User.find();
        users.forEach(async (user) => {
            await user.courses.pull({ _id: course._id });
            await user.save();
        });

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
};

exports.updateCourse = async (req, res) => {
  try {    

    const course = await Course.findOne({slug:req.params.slug});
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    course.save();

    res.status(200).redirect('/users/dashboard');

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};
