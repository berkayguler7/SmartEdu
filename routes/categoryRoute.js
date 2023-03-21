const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);

// router.route('/:slug')
//     .get(categoryController.getCategory)

module.exports = router;
