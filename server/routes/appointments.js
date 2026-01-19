const router = require('express').Router();
const Appointment = require('../models/Appointment');
const verify = require('../middleware/verifyToken');
const jwt = require('jsonwebtoken');

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

// Get pending appointment count (Admin)
router.get('/pending-count', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
    try {
        const count = await Appointment.countDocuments({ status: 'pending' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment status (Admin only)
router.patch('/:id/status', verify, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });

    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = req.body.status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Helper to parse duration string to minutes
const parseDuration = (durationStr) => {
    if (!durationStr) return 60; // default 1 hour
    const parts = durationStr.split(' ');
    const val = parseFloat(parts[0]);
    if (durationStr.includes('hour')) return val * 60;
    if (durationStr.includes('min')) return val;
    return 60;
};

// Create appointment (Public - Guest or User)
router.post('/', async (req, res) => {
    // Check if token provided (optional)
    const token = req.header('auth-token');
    let userId = null;

    if (token) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            userId = verified._id;
        } catch (err) {
            console.log('Invalid token provided for appointment (treating as guest)');
        }
    }

    try {
        // CONFLICT CHECK
        const newDate = new Date(req.body.date);
        const requestedService = await require('../models/Service').findById(req.body.serviceId);
        if (!requestedService) return res.status(400).json({ message: 'Invalid Service' });

        const newDuration = parseDuration(requestedService.duration);
        const newEndTime = new Date(newDate.getTime() + newDuration * 60000);

        // Find all confirmed appointments to check overlap
        // We only care about future appointments around the same time
        const startSearch = new Date(newDate.getTime() - 24 * 60 * 60 * 1000); // look back 24h just in case (overkill but safe)
        const endSearch = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);

        const existingAppointments = await Appointment.find({
            status: 'confirmed',
            date: { $gte: startSearch, $lte: endSearch }
        }).populate('service');

        const hasConflict = existingAppointments.some(appt => {
            const existingStart = new Date(appt.date);
            const existingDuration = parseDuration(appt.service.duration);
            const existingEnd = new Date(existingStart.getTime() + existingDuration * 60000);

            // Check overlap logic: StartA < EndB && EndA > StartB
            return (newDate < existingEnd && newEndTime > existingStart);
        });

        if (hasConflict) {
            return res.status(400).json({ message: 'This time slot is already booked and confirmed.' });
        }


        const appointmentData = {
            service: req.body.serviceId,
            date: req.body.date,
            notes: req.body.notes
        };

        if (userId) {
            appointmentData.user = userId;
        } else {
            appointmentData.guest = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone
            };
        }

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
