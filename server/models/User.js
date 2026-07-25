const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
