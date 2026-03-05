const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Remove the options as they might be causing issues
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please make sure MongoDB is running on your system');
    process.exit(1);
  }
};

module.exports = connectDB;