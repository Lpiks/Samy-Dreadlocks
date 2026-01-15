require('dotenv').config();
const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const User = require('./models/User');

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check Appointments
        const appointments = await Appointment.find({});
        console.log(`Total Appointments: ${appointments.length}`);
        if (appointments.length > 0) {
            console.log('Sample Appointment:', JSON.stringify(appointments[0], null, 2));
        }

        // Check Users
        const users = await User.find({});
        console.log(`Total Users: ${users.length}`);
        users.forEach(u => console.log(`- ${u.username} (${u.role})`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
