require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding Services');

        // Clear existing services to avoid duplicates
        await Service.deleteMany({});
        console.log('Cleared existing services');

        const services = [
            { 
                name: 'Traditional Locs', 
                description: 'Classic starter locs using comb coil or palm roll method.', 
                price: 150, 
                duration: '3-4 hours', 
                imageUrl: '' // Handled by frontend local images mapping
            },
            { 
                name: 'Loc Retwist', 
                description: 'Clean up new growth and maintain neat parts.', 
                price: 85, 
                duration: '2 hours', 
                imageUrl: '' 
            },
            { 
                name: 'Interlocking', 
                description: 'Maintenance method using a tool for longer lasting results.', 
                price: 120, 
                duration: '3 hours', 
                imageUrl: '' 
            },
            { 
                name: 'Loc Extensions', 
                description: 'Instant length using 100% human hair.', 
                price: 500, 
                duration: '6-8 hours', 
                imageUrl: '' 
            }
        ];

        // Insert Services
        const insertedServices = await Service.insertMany(services);
        console.log(`Inserted ${insertedServices.length} services`);

        console.log('Services Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding services:', error);
        process.exit(1);
    }
};

seedServices();
