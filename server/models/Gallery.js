const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Gallery', gallerySchema);
