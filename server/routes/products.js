const router = require('express').Router();
const Product = require('../models/Product');
const verify = require('../middleware/verifyToken');

// GET ALL PRODUCTS (Public)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET SINGLE PRODUCT (Public)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// CREATE PRODUCT (Admin Only)
router.post('/', verify, async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        inStock: req.body.inStock
    });

    try {
        const savedProduct = await product.save();
        res.json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE PRODUCT (Admin Only)
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE PRODUCT (Admin Only)
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!removedProduct) return res.status(404).json({ message: "Product not found" });
        res.json(removedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
