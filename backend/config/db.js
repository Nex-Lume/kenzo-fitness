const mongoose = require('mongoose');
const dns = require('node:dns');

// Force Node.js to use public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kenzofitness');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
