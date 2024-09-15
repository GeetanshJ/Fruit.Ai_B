const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://jaingeetansh:Geetansh@cluster0.pe43o.mongodb.net/fruit';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
