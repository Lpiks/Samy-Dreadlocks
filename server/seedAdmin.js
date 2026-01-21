require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        let adminUser = await User.findOne({ role: 'admin' });

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (adminUser) {
            console.log('Admin account found. Updating password...');
            adminUser.password = hashedPassword;
            adminUser.username = username; // Also update username to match .env if needed
            await adminUser.save();
            console.log(`Admin password updated successfully. Username: ${username}`);
            process.exit(0);
        }

        const newAdmin = new User({
            username: username,
            password: hashedPassword,
            role: 'admin'
        });

        await newAdmin.save();
        console.log(`Admin created successfully with username: ${username} and password: ${password}`); // Log password only for initial setup (or valid concern) - maybe better not to log plain text password in production, but for a dev tool OK.

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
