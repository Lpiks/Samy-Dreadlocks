const router = require('express').Router();
const appointmentController = require('../controllers/appointmentController');
const verify = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const rateLimit = require('express-rate-limit');

// Rate limiter: maximum 5 bookings per hour per IP
const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many booking attempts from this IP, please try again after an hour'
});

// Get all appointments (Admin) or User's appointments
// Note: 'verify' is still used here as it handles both Admin and standard User logic internally
router.get('/', verify, appointmentController.getAppointments);

// Get pending appointment count (Admin)
router.get('/pending-count', verifyAdmin, appointmentController.getPendingCount);

// Get availability for a specific date (Public)
router.get('/availability', appointmentController.getAvailability);

// Update appointment status (Admin only)
router.patch('/:id/status', verifyAdmin, appointmentController.updateStatus);

// Create appointment (Public - Guest or User)
router.post('/', bookingLimiter, appointmentController.createAppointment);

module.exports = router;
