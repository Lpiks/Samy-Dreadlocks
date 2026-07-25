const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^(?:\+213|0)[567]\d{8}$/, 'Please provide a valid Algerian phone number (+213 or 0 followed by 5, 6, or 7 and 8 digits)'],
        maxlength: 50
    },
    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
