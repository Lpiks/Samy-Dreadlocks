const Category = require('../models/Category');

// GET - Get all categories (Public)
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// POST - Create a new category (Admin only)
exports.createCategory = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name
        });
        const savedCategory = await category.save();
        res.json(savedCategory);
    } catch (err) {
        res.status(400).send(err); // Keeping original error format for now, or standardize?
    }
};

// DELETE - Delete a category (Admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const removedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!removedCategory) return res.status(404).send("Category not found");
        res.json(removedCategory);
    } catch (err) {
        res.status(400).send(err);
    }
};
