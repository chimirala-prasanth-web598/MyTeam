const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'certificate_generator'
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log('Database Name:', conn.connection.name);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Log more details about the error
        if (error.code === 'ENOTFOUND') {
            console.error('Could not reach the MongoDB server. Check your internet connection');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('Connection to MongoDB timed out');
        } else if (error.name === 'MongoServerError') {
            console.error('Authentication failed. Check your credentials');
        }
        process.exit(1);
    }
};

module.exports = connectDB;