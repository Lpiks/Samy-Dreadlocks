const router = require('express').Router();
const Gallery = require('../models/Gallery');
const verify = require('../middleware/verifyToken');

// GET ALL IMAGES
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD IMAGE (Admin only)
router.post('/', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    const galleryItem = new Gallery({
        imageUrl: req.body.imageUrl
    });

    try {
        const savedItem = await galleryItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE IMAGE (Admin only)
router.delete('/:id', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const removedItem = await Gallery.findByIdAndDelete(req.params.id);
        if (!removedItem) return res.status(404).json({ message: 'Image not found' });
        res.json({ message: 'Image deleted', _id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
