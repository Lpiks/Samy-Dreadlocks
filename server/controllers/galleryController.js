const Gallery = require('../models/Gallery');

// GET ALL IMAGES
exports.getAllImages = async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD IMAGE (Admin only)
exports.addImage = async (req, res) => {
    const galleryItem = new Gallery({
        imageUrl: req.body.imageUrl
    });

    try {
        const savedItem = await galleryItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE IMAGE (Admin only)
exports.deleteImage = async (req, res) => {
    try {
        const removedItem = await Gallery.findByIdAndDelete(req.params.id);
        if (!removedItem) return res.status(404).json({ message: 'Image not found' });
        res.json({ message: 'Image deleted', _id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
