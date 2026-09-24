const connectDB = require('./config/db');
const { GymUser, Membership, Member, Attendance, Otp } = require('./models');

// Connect to MongoDB if this file is executed directly (e.g., node db.js)
if (require.main === module) {
  connectDB()
    .then(() => {
      console.log('✅ MongoDB connection verified successfully via db.js');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = {
  connectDB,
  GymUser,
  Membership,
  Member,
  Attendance,
  Otp
};
