const mongoose = require('mongoose');

// 1. Gym / Owner / Trainer User Model
const gymUserSchema = new mongoose.Schema({
  gymId: { type: String, index: true },
  userName: { type: String, required: true },
  gymName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Trainer'], default: 'Admin' },
  phone: { type: String, default: '' },
  specialty: { type: String, default: 'General Fitness & Strength' },
  profilePic: { type: String, default: '' },
  isFirstLogin: { type: Boolean, default: true },
  googleId: { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Membership Package / Plan Model
const membershipSchema = new mongoose.Schema({
  gymId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  months: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: 'Full gym access & equipment' },
  createdAt: { type: Date, default: Date.now }
});

// 3. Member / Joinee Model
const memberSchema = new mongoose.Schema({
  gymId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, default: '' },
  password: { type: String, default: '' },
  isFirstLogin: { type: Boolean, default: true },
  address: { type: String, default: '' },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  joiningDate: { type: String, required: true },
  membershipPlan: { type: String, required: true },
  membershipMonths: { type: Number, default: 1 },
  nextBillDate: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
  profilePic: { type: String, default: '' },
  googleId: { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  createdAt: { type: Date, default: Date.now }
});

// 4. Attendance Record Model
const attendanceSchema = new mongoose.Schema({
  gymId: { type: String, required: true, index: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  memberName: { type: String, required: true },
  mobileNo: { type: String, required: true },
  membershipPlan: { type: String, default: 'General' },
  profilePic: { type: String, default: '' },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  timeIn: { type: String, required: true }, // Format: 07:15 AM
  timeOut: { type: String, default: null }, // Format: 08:30 AM
  status: { type: String, enum: ['In Gym', 'Completed'], default: 'In Gym' },
  createdAt: { type: Date, default: Date.now }
});

// 5. Password Reset OTP Verification Model
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  otp: { type: String, required: true },
  role: { type: String, default: 'Any' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  GymUser: mongoose.model('GymUser', gymUserSchema),
  Membership: mongoose.model('Membership', membershipSchema),
  Member: mongoose.model('Member', memberSchema),
  Attendance: mongoose.model('Attendance', attendanceSchema),
  Otp: mongoose.model('Otp', otpSchema)
};
