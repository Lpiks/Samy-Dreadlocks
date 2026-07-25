const router = require('express').Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const rateLimit = require('express-rate-limit');

// Strict rate limit for brute-force protection
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
});

// Login
router.post('/login', loginLimiter, authController.login);

// Verify Session (used by frontend to check HttpOnly cookie)
router.get('/verify', verifyToken, (req, res) => {
    res.json({ isAuthenticated: true, user: req.user });
});

// Logout (clear the cookie)
router.post('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 0, httpOnly: true });
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
