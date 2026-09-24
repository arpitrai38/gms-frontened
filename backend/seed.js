require('dotenv').config();
const mongoose = require('mongoose');
const { GymUser, Membership, Member } = require('./models');

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gym_management';
    await mongoose.connect(uri);
    console.log('🍃 Connected to MongoDB for multi-role seed...');

    await mongoose.connection.db.dropDatabase();
    console.log('🧹 Cleaned previous database...');

    // 1. Seed Admin
    const admin = await GymUser.create({
      userName: 'Alex Mercer',
      gymName: 'IronPulse Fitness Club',
      email: 'admin@gym.com',
      password: 'admin123',
      role: 'Admin',
      phone: '+91 98765 43210'
    });
    const adminGymId = admin._id.toString();

    // 2. Seed Trainer
    await GymUser.create({
      gymId: adminGymId,
      userName: 'Coach Vikram',
      gymName: 'IronPulse Fitness Club',
      email: 'trainer@gym.com',
      password: 'trainer123',
      role: 'Trainer',
      phone: '+91 98112 33445',
      specialty: 'Hypertrophy & Strength Training',
      isFirstLogin: false
    });

    // 3. Seed Membership Packages
    await Membership.create([
      { gymId: adminGymId, title: '1 Month Plan', months: 1, price: 1000, description: 'Standard monthly gym access & general cardio' },
      { gymId: adminGymId, title: '3 Months Plan', months: 3, price: 2500, description: 'Quarterly training with free locker facility' },
      { gymId: adminGymId, title: '6 Months Plan', months: 6, price: 4500, description: 'Half-yearly package with trainer guidance' },
      { gymId: adminGymId, title: '1 Year Plan', months: 12, price: 8000, description: 'Annual VIP package with free protein shakes' }
    ]);

    // 4. Seed Members with login passwords
    const today = new Date();
    
    // Member 1: Rahul Sharma (Active)
    const m1Join = new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0];
    const m1Bill = new Date(today.getFullYear(), today.getMonth() + 3, 5).toISOString().split('T')[0];
    await Member.create({
      gymId: adminGymId,
      name: 'Rahul Sharma',
      mobileNo: '9876543210',
      email: 'rahul@gmail.com',
      password: 'password123',
      isFirstLogin: false,
      address: 'B-12, Green Park, New Delhi',
      gender: 'Male',
      joiningDate: m1Join,
      membershipPlan: '3 Months Plan',
      membershipMonths: 3,
      nextBillDate: m1Bill,
      amountPaid: 2500,
      status: 'Active',
      profilePic: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });

    // Member 2: Priya Patel (Active)
    const m2Join = new Date(today.getFullYear(), today.getMonth(), 10).toISOString().split('T')[0];
    const m2Bill = new Date(today.getFullYear(), today.getMonth() + 1, 10).toISOString().split('T')[0];
    await Member.create({
      gymId: adminGymId,
      name: 'Priya Patel',
      mobileNo: '9823456781',
      email: 'priya@gmail.com',
      password: 'password123',
      isFirstLogin: false,
      address: 'A-45, Malviya Nagar, Jaipur',
      gender: 'Female',
      joiningDate: m2Join,
      membershipPlan: '1 Month Plan',
      membershipMonths: 1,
      nextBillDate: m2Bill,
      amountPaid: 1000,
      status: 'Active',
      profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    });

    // Member 3: Aman Verma (Expired)
    const m3Join = new Date(today.getFullYear(), today.getMonth() - 2, 1).toISOString().split('T')[0];
    const m3Bill = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
    await Member.create({
      gymId: adminGymId,
      name: 'Aman Verma',
      mobileNo: '9711223344',
      email: 'aman@gmail.com',
      password: 'password123',
      isFirstLogin: false,
      address: 'Flat 302, Royal Heights, Mumbai',
      gender: 'Male',
      joiningDate: m3Join,
      membershipPlan: '1 Month Plan',
      membershipMonths: 1,
      nextBillDate: m3Bill,
      amountPaid: 1000,
      status: 'Expired',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    console.log('✅ Multi-role database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = seedDB;
