const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const jwt = require('jsonwebtoken');

// Helper to parse duration string to minutes
const parseDuration = (durationStr) => {
    if (!durationStr) return 60; // default 1 hour
    const parts = durationStr.split(' ');
    const val = parseFloat(parts[0]);
    if (durationStr.includes('hour')) return val * 60;
    if (durationStr.includes('min')) return val;
    return 60;
};

// Get all appointments (Admin) or User's appointments
exports.getAppointments = async (req, res) => {
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
};

// Get pending appointment count (Admin)
exports.getPendingCount = async (req, res) => {
    try {
        const count = await Appointment.countDocuments({ status: 'pending' });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update appointment status (Admin only)
exports.updateStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.status = req.body.status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create appointment (Public - Guest or User)
exports.createAppointment = async (req, res) => {
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
        if (isNaN(newDate.getTime())) return res.status(400).json({ message: 'Invalid Date Format' });

        const requestedService = await Service.findById(req.body.serviceId);
        if (!requestedService) return res.status(400).json({ message: 'Invalid Service' });

        const newDuration = parseDuration(requestedService.duration);
        const newEndTime = new Date(newDate.getTime() + newDuration * 60000);

        // Find all confirmed appointments to check overlap
        const startSearch = new Date(newDate.getTime() - 24 * 60 * 60 * 1000); // look back 24h
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
            notes: req.body.notes,
            guest: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone
            }
        };

        if (userId) {
            appointmentData.user = userId;
        }

        const appointment = new Appointment(appointmentData);
        const savedAppointment = await appointment.save();
        res.status(201).json(savedAppointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
