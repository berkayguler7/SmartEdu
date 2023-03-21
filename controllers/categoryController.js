const Category = require('../models/Category');
const Course = require('../models/Course');

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const courses = await Course.find({ category: req.params.id });
        if (courses.length > 0) {
            await Course.updateMany(
                { category: req.params.id },
                { category: '64199669349394bb896893be' } //hardcoded id of uncategorized
            );
        }
        await Category.findByIdAndRemove(req.params.id)
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};
