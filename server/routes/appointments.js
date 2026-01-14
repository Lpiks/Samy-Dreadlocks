const router = require('express').Router();
const Appointment = require('../models/Appointment');
const verify = require('../middleware/verifyToken');

// Get all appointments (Admin) or User's appointments
router.get('/', verify, async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'admin') {
            appointments = await Appointment.find().populate('user').populate('service');
        } else {
            appointments = await Appointment.find({ user: req.user._id }).populate('service');
        }
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create appointment
router.post('/', verify, async (req, res) => {
    const appointment = new Appointment({
        user: req.user._id,
        service: req.body.serviceId,
        date: req.body.date,
        notes: req.body.notes
    });

    try {
        const savedAppointment = await appointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
