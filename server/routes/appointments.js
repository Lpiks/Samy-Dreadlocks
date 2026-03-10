const router = require('express').Router();
const appointmentController = require('../controllers/appointmentController');
const verify = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

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
router.post('/', appointmentController.createAppointment);

module.exports = router;
