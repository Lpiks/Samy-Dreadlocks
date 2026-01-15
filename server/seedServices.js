require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const checkServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const services = await Service.find({});
        console.log(`Total Services: ${services.length}`);
        services.forEach(s => console.log(`- ${s.name} (ID: ${s._id})`));

        if (services.length === 0) {
            console.log('Creating default services...');
            await Service.insertMany([
                { name: 'Traditional Locs', description: 'Start your journey', price: 100, duration: '2 hours' },
                { name: 'Loc Retwist', description: 'Maintenance', price: 80, duration: '1.5 hours' },
                { name: 'Interlocking', description: 'Root maintenance', price: 120, duration: '2.5 hours' },
                { name: 'Loc Extensions', description: 'Instant length', price: 300, duration: '4 hours' }
            ]);
            console.log('Default services created.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkServices();
