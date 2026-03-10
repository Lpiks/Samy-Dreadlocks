const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const verifyAdmin = require('../middleware/verifyAdmin');

// Initialize default settings for all 7 days if they don't exist
const initializeSettings = async () => {
    try {
        const count = await Setting.countDocuments();
        if (count === 0) {
            const defaultSettings = [];
            for (let i = 0; i < 7; i++) {
                defaultSettings.push({
                    dayOfWeek: i,
                    isOpen: true,
                    openTime: '08:00',
                    closeTime: '23:00'
                });
            }
            await Setting.insertMany(defaultSettings);
            console.log('Default schedule settings initialized.');
        }
    } catch (err) {
        console.error('Error initializing settings:', err);
    }
};

// Immediately invoke initialization
initializeSettings();

// GET /api/settings/schedule - Get all schedule settings (Public so Booking page can read it)
router.get('/schedule', async (req, res) => {
    try {
        const schedule = await Setting.find().sort({ dayOfWeek: 1 });
        res.json(schedule);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        res.status(500).json({ message: 'Server error fetching schedule' });
    }
});

// PUT /api/settings/schedule/:dayOfWeek - Update a specific day's schedule (Admin Only)
router.put('/schedule/:dayOfWeek', verifyAdmin, async (req, res) => {
    try {
        const day = parseInt(req.params.dayOfWeek);
        if (day < 0 || day > 6) {
            return res.status(400).json({ message: 'Invalid day of week' });
        }

        const { isOpen, openTime, closeTime } = req.body;

        const updatedSetting = await Setting.findOneAndUpdate(
            { dayOfWeek: day },
            { isOpen, openTime, closeTime },
            { new: true, upsert: true } // upsert ensures it creates if somehow missing
        );

        res.json(updatedSetting);
    } catch (err) {
        console.error('Error updating schedule:', err);
        res.status(500).json({ message: 'Server error updating schedule' });
    }
});

module.exports = router;
