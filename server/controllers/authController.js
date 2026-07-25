const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginValidation } = require('../utils/validation');

// LOGIN
exports.login = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, password } = req.body;

        // Check user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        // Create token
        const token = jwt.sign(
            { _id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Critical: Token expires in 1 day
        );
        
        // Send token as HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ user: { _id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
