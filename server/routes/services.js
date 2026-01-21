const router = require('express').Router();
const serviceController = require('../controllers/serviceController');
const verifyAdmin = require('../middleware/verifyAdmin');

// Get all services
router.get('/', serviceController.getAllServices);

// Create service (Admin only)
router.post('/', verifyAdmin, serviceController.createService);

// Update service (Admin only)
router.put('/:id', verifyAdmin, serviceController.updateService);

// Delete service (Admin only)
router.delete('/:id', verifyAdmin, serviceController.deleteService);

module.exports = router;
