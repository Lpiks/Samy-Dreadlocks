const router = require('express').Router();
const Message = require('../models/Message');
const verify = require('../middleware/verifyToken');
const rateLimit = require('express-rate-limit');

// Rate limiter: maximum 3 messages per hour per IP
const messageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many messages sent from this IP, please try again after an hour'
});

// Validation - Manual
const messageValidation = (data) => {
    const errors = {};
    if (!data.name || data.name.length < 2) errors.name = "Name is required (min 2 chars)";
    if (!data.phone || !/^(?:\+213|0)[567]\d{8}$/.test(data.phone)) {
        errors.phone = "Please provide a valid Algerian phone number (+213 or 0 followed by 5, 6, or 7 and 8 digits)";
    }
    if (!data.subject || data.subject.length < 2) errors.subject = "Subject is required (min 2 chars)";
    if (!data.message || data.message.length < 2) errors.message = "Message is required (min 2 chars)";

    return {
        error: Object.keys(errors).length > 0 ? { details: [{ message: Object.values(errors).join(', ') }] } : null
    };
};

// POST - Create a new message (Public)
router.post('/', messageLimiter, async (req, res) => {
    // Validate data
    const { error } = messageValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const message = new Message({
        name: req.body.name,
        phone: req.body.phone,
        subject: req.body.subject,
        message: req.body.message
    });

    try {
        const savedMessage = await message.save();
        res.send({ message: "Message sent successfully", data: savedMessage });
    } catch (err) {
        res.status(400).send(err);
    }
});

// GET - Get pending message count (Admin only)
router.get('/pending-count', verify, async (req, res) => {
    try {
        const count = await Message.countDocuments({ status: 'pending' });
        res.json({ count });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET - Get all messages (Admin only)
router.get('/', verify, async (req, res) => {
    try {
        const messages = await Message.find().sort({ date: -1 });
        res.json(messages);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH - Update message status (Admin only)
router.patch('/:id/status', verify, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!message) return res.status(404).send("Message not found");
        res.json(message);
    } catch (err) {
        res.status(400).send(err);
    }
});

// DELETE - Delete a message (Admin only)
router.delete('/:id', verify, async (req, res) => {
    try {
        const removedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!removedMessage) return res.status(404).send("Message not found");
        res.json(removedMessage);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
