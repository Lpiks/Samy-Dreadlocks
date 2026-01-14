const router = require('express').Router();
const Service = require('../models/Service');
const verify = require('../middleware/verifyToken');

// Get all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create service (Admin only - TODO: Add admin check)
router.post('/', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    const service = new Service({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        time: req.body.time,
        imageUrl: req.body.imageUrl
    });

    try {
        const savedService = await service.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
