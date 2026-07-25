const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    image: {
        type: String, // URL to the image
        required: true,
        trim: true,
        maxlength: 1000
    },
    category: {
        type: String,
        default: 'General',
        trim: true,
        maxlength: 100
    },
    inStock: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', ProductSchema);
