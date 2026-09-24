require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_management';
    let uri = rawUri.trim().replace(/^["']|["']$/g, '').replace(/^(MONGODB_URI|MONGO_URI|MONGO)\s*=\s*/i, '');


    const conn = await mongoose.connect(uri, {
      dbName: 'gym_management',
      serverSelectionTimeoutMS: 10000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`💡 Tip: Check that MONGODB_URI or MONGO_URI in your environment or Render Dashboard is valid and Network Access allows 0.0.0.0/0.`);
    process.exit(1);
  }
};

module.exports = connectDB;
