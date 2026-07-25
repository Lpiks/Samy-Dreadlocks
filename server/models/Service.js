const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String, // e.g., "2 hours"
        required: true,
        trim: true,
        maxlength: 50
    },
    imageUrl: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Service', serviceSchema);
