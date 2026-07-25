require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');

        // Clear existing categories and products
        await Category.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing categories and products');

        // Define Categories
        const categories = [
            { name: 'Shampoos & Conditioners' },
            { name: 'Locking Gels & Waxes' },
            { name: 'Oils & Serums' },
            { name: 'Accessories' }
        ];

        // Insert Categories
        const insertedCategories = await Category.insertMany(categories);
        console.log(`Inserted ${insertedCategories.length} categories`);

        // Define Products
        const products = [
            {
                name: 'Residue-Free Dreadlock Shampoo',
                price: 2500, // Assuming DZD
                description: 'A deep-cleansing, residue-free shampoo specifically designed for dreadlocks. Keeps locks tight and scalp clean.',
                image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop', // Placeholder shampoo image
                category: 'Shampoos & Conditioners',
                inStock: true
            },
            {
                name: 'Organic Locking Gel',
                price: 1800,
                description: 'Natural aloe vera based locking gel. Provides great hold without flaking or buildup. Perfect for retwisting.',
                image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop', // Placeholder gel image
                category: 'Locking Gels & Waxes',
                inStock: true
            },
            {
                name: 'Peppermint Scalp Oil',
                price: 1500,
                description: 'Soothes dry, itchy scalp and promotes hair growth. Infused with natural peppermint and tea tree oil.',
                image: 'https://images.unsplash.com/photo-1608248593842-8eb8307ce459?q=80&w=1887&auto=format&fit=crop', // Placeholder oil image
                category: 'Oils & Serums',
                inStock: true
            },
            {
                name: 'Silk Sleeping Cap',
                price: 1200,
                description: 'Protect your locks while you sleep. Prevents lint buildup and retains moisture.',
                image: 'https://images.unsplash.com/photo-1582239454153-53d994344db6?q=80&w=1887&auto=format&fit=crop', // Placeholder cap image
                category: 'Accessories',
                inStock: true
            },
            {
                name: 'Crochet Needle Set',
                price: 900,
                description: 'Set of high-quality crochet needles for dreadlock maintenance and repair.',
                image: 'https://images.unsplash.com/photo-1574880560799-a1b73e51f8a8?q=80&w=1969&auto=format&fit=crop', // Placeholder tools image
                category: 'Accessories',
                inStock: true
            }
        ];

        // Insert Products
        const insertedProducts = await Product.insertMany(products);
        console.log(`Inserted ${insertedProducts.length} products`);

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
