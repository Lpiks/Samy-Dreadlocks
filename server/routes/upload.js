const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const verify = require('../middleware/verifyToken');

// Configure Multer (use memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', verify, upload.single('image'), async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        // Upload to Cloudinary using stream
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'samy-locks',
            resource_type: 'auto'
        });

        res.json({ url: result.secure_url });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Image upload failed' });
    }
});

module.exports = router;
