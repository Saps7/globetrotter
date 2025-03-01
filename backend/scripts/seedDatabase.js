const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const Destination = require('../models/destination');

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Read the JSON file
        const rawData = await fs.readFile(
            path.join(__dirname, '../data/data.json'),
            'utf-8'
        );
        const destinations = JSON.parse(rawData);

        // Clear existing data
        await Destination.deleteMany({});
        console.log('Cleared existing destinations');

        // Insert new data
        const result = await Destination.insertMany(destinations);
        console.log(`Successfully inserted ${result.length} destinations`);

        console.log('Database seeding completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeding function
seedDatabase();