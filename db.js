const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI)
            .then(() => console.log('Connected to MongoDB Atlas'))
            .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));
        
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
