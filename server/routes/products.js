const router = require('express').Router();
const productController = require('../controllers/productController');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET ALL PRODUCTS (Public)
router.get('/', productController.getAllProducts);

// GET SINGLE PRODUCT (Public)
router.get('/:id', productController.getProductById);

// CREATE PRODUCT (Admin Only)
router.post('/', verifyAdmin, productController.createProduct);

// UPDATE PRODUCT (Admin Only)
router.put('/:id', verifyAdmin, productController.updateProduct);

// DELETE PRODUCT (Admin Only)
router.delete('/:id', verifyAdmin, productController.deleteProduct);

module.exports = router;
