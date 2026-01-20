const router = require('express').Router();
const Category = require('../models/Category');
const verify = require('../middleware/verifyToken');

// GET - Get all categories (Public)
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST - Create a new category (Admin only)
router.post('/', verify, async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name
        });
        const savedCategory = await category.save();
        res.json(savedCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE - Delete a category (Admin only)
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!removedCategory) return res.status(404).send("Category not found");
        res.json(removedCategory);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
