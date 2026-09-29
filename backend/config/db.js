require('dotenv').config();
const mongoose = require('mongoose');

const dns = require('dns');
// Use reliable public DNS to prevent Windows querySrv ECONNREFUSED issues with Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

const connectDB = async () => {
  let rawUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym_management';
  let uri = rawUri.trim().replace(/^["']|["']$/g, '').replace(/^(MONGODB_URI|MONGO_URI|MONGO)\s*=\s*/i, '');

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'gym_management',
      serverSelectionTimeoutMS: 10000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.warn(`⚠️ Cloud MongoDB connection failed (${error.message}). Attempting fallback to local MongoDB...`);
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/gym_management', {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`🍃 Connected to Local MongoDB fallback: ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      console.error(`💡 Tip: Check that MONGODB_URI or MONGO_URI in your environment or Render Dashboard is valid and Network Access allows 0.0.0.0/0.`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
