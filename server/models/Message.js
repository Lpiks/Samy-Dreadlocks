const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name: {
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
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'responded']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);
