const router = require('express').Router();
const galleryController = require('../controllers/galleryController');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET ALL IMAGES
router.get('/', galleryController.getAllImages);

// ADD IMAGE (Admin only)
router.post('/', verifyAdmin, galleryController.addImage);

// DELETE IMAGE (Admin only)
router.delete('/:id', verifyAdmin, galleryController.deleteImage);

module.exports = router;
