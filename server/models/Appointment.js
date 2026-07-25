const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    guest: {
        name: { type: String, trim: true, maxlength: 100 },
        email: { 
            type: String, 
            trim: true, 
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email address'],
            maxlength: 100 
        },
        phone: { 
            type: String, 
            trim: true, 
            match: [/^(?:\+213|0)[567]\d{8}$/, 'Please provide a valid Algerian phone number (+213 or 0 followed by 5, 6, or 7 and 8 digits)'],
            maxlength: 50 
        }
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
