const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    // Represents days of the week: 0 (Sunday) to 6 (Saturday)
    dayOfWeek: {
        type: Number,
        required: true,
        unique: true,
        min: 0,
        max: 6
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    openTime: {
        type: String, // Format: "HH:mm" (24-hour)
        default: '08:00'
    },
    closeTime: {
        type: String, // Format: "HH:mm" (24-hour)
        default: '23:00'
    }
});

module.exports = mongoose.model('Setting', SettingSchema);
