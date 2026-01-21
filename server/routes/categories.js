const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET - Get all categories (Public)
router.get('/', categoryController.getAllCategories);

// POST - Create a new category (Admin only)
router.post('/', verifyAdmin, categoryController.createCategory);

// DELETE - Delete a category (Admin only)
router.delete('/:id', verifyAdmin, categoryController.deleteCategory);

module.exports = router;
