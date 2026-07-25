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
        type: String, // format HH:mm
        default: '09:00',
        trim: true,
        maxlength: 10
    },
    closeTime: {
        type: String, // format HH:mm
        default: '17:00',
        trim: true,
        maxlength: 10
    }
});

module.exports = mongoose.model('Setting', SettingSchema);
