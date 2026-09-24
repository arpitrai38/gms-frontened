require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { GymUser, Membership, Member, Attendance, Otp } = require('./models');
const { sendOtpEmail } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to extract gymId from headers, query, or body
const getGymId = (req) => {
  return req.headers['x-gym-id'] || req.query.gymId || req.body?.gymId || null;
};

// Helper to auto-update expired status based on nextBillDate
const checkAndUpdateExpiredStatus = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await Member.updateMany(
      { nextBillDate: { $lt: todayStr }, status: 'Active' },
      { status: 'Expired' }
    );
  } catch (err) {
    console.error('Status check error:', err.message);
  }
};

// -------------------------------------------------------------
// 1. AUTHENTICATION (ADMIN, TRAINER, MEMBER LOGIN & REGISTER)
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrMobile, password, role } = req.body;
    if (!emailOrMobile || !password) {
      return res.status(400).json({ success: false, message: 'Email/Mobile and password are required' });
    }

    const input = emailOrMobile.trim();

    // 1. MEMBER LOGIN
    if (role === 'Member') {
      const member = await Member.findOne({
        $or: [
          { mobileNo: input },
          { email: input.toLowerCase() }
        ]
      });

      if (!member) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number/email or password' });
      }

      // Check password: match saved password, OR member's name only on first-time login
      const isFirst = member.isFirstLogin !== false;
      const nameMatches = isFirst && member.name && member.name.toLowerCase().trim() === password.toLowerCase().trim();
      const passMatches = member.password && member.password === password;

      if (!passMatches && !nameMatches) {
        return res.status(401).json({ success: false, message: 'Invalid mobile number/email or password' });
      }

      return res.json({
        success: true,
        role: 'Member',
        member: {
          id: member._id,
          _id: member._id,
          gymId: member.gymId,
          name: member.name,
          mobileNo: member.mobileNo,
          email: member.email,
          address: member.address,
          gender: member.gender,
          membershipPlan: member.membershipPlan,
          joiningDate: member.joiningDate,
          nextBillDate: member.nextBillDate,
          amountPaid: member.amountPaid,
          status: member.status,
          profilePic: member.profilePic || '',
          isFirstLogin: isFirst
        }
      });
    }

    // 2. TRAINER LOGIN
    if (role === 'Trainer') {
      const trainer = await GymUser.findOne({
        role: 'Trainer',
        $or: [
          { email: input.toLowerCase() },
          { phone: input }
        ]
      });

      if (!trainer) {
        return res.status(401).json({ success: false, message: 'Invalid trainer email/phone or password' });
      }

      // First-time login: allow trainer's name as password
      const isFirst = trainer.isFirstLogin !== false;
      const nameMatches = isFirst && trainer.userName && trainer.userName.toLowerCase().trim() === password.toLowerCase().trim();
      const passMatches = trainer.password && trainer.password === password;

      if (!passMatches && !nameMatches) {
        return res.status(401).json({ success: false, message: 'Invalid trainer email/phone or password' });
      }

      return res.json({
        success: true,
        role: trainer.role,
        isFirstLogin: isFirst,
        user: {
          id: trainer._id,
          _id: trainer._id,
          gymId: trainer.gymId || trainer._id.toString(),
          userName: trainer.userName,
          gymName: trainer.gymName,
          email: trainer.email,
          role: trainer.role,
          phone: trainer.phone,
          specialty: trainer.specialty,
          profilePic: trainer.profilePic || '',
          isFirstLogin: isFirst
        }
      });
    }

    // 3. ADMIN LOGIN
    const adminUser = await GymUser.findOne({
      email: input.toLowerCase(),
      role: 'Admin'
    });

    if (!adminUser || adminUser.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    res.json({
      success: true,
      role: adminUser.role,
      user: {
        id: adminUser._id,
        _id: adminUser._id,
        gymId: adminUser._id.toString(),
        userName: adminUser.userName,
        gymName: adminUser.gymName,
        email: adminUser.email,
        role: adminUser.role,
        phone: adminUser.phone,
        specialty: adminUser.specialty,
        profilePic: adminUser.profilePic || ''
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Gym Owner Signup (Always starts completely fresh and blank)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { userName, gymName, email, password, phone, profilePic } = req.body;
    if (!userName || !gymName || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await GymUser.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const newUser = await GymUser.create({
      userName: userName.trim(),
      gymName: gymName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'Admin',
      phone: phone || '',
      profilePic: profilePic || ''
    });

    const newGymId = newUser._id.toString();

    // Auto-create standard starter membership packages for this new gym
    await Membership.create([
      { gymId: newGymId, title: '1 Month Plan', months: 1, price: 1000, description: 'Standard monthly gym access & general cardio' },
      { gymId: newGymId, title: '3 Months Plan', months: 3, price: 2500, description: 'Quarterly training with free locker facility' },
      { gymId: newGymId, title: '6 Months Plan', months: 6, price: 4500, description: 'Half-yearly package with trainer guidance' },
      { gymId: newGymId, title: '1 Year Plan', months: 12, price: 8000, description: 'Annual VIP package with free protein shakes' }
    ]);

    // Note: 0 members and 0 attendance records are created. Entire gym data is completely fresh and blank!
    res.json({
      success: true,
      role: 'Admin',
      user: {
        id: newUser._id,
        gymId: newGymId,
        userName: newUser.userName,
        gymName: newUser.gymName,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        profilePic: newUser.profilePic || ''
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// GOOGLE OAUTH LOGIN & AUTO-REGISTRATION
// -------------------------------------------------------------
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, picture, googleId, role = 'Admin', gymName, phone } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const displayName = name ? name.trim() : cleanEmail.split('@')[0];
    const userRole = role || 'Admin';

    // Helper to find or assign primary gym workspace
    const getActiveGym = async () => {
      let gym = await GymUser.findOne({ role: 'Admin' });
      if (!gym) {
        gym = await GymUser.create({
          userName: 'Gym Administrator',
          gymName: 'IronPulse Fitness Club',
          email: 'admin@gym.com',
          password: 'admin123',
          role: 'Admin',
          phone: '+91 98765 43210'
        });
        await Membership.create([
          { gymId: gym._id.toString(), title: '1 Month Plan', months: 1, price: 1000, description: 'Standard monthly gym access & general cardio' },
          { gymId: gym._id.toString(), title: '3 Months Plan', months: 3, price: 2500, description: 'Quarterly training with free locker facility' },
          { gymId: gym._id.toString(), title: '6 Months Plan', months: 6, price: 4500, description: 'Half-yearly package with trainer guidance' },
          { gymId: gym._id.toString(), title: '1 Year Plan', months: 12, price: 8000, description: 'Annual VIP package with free protein shakes' }
        ]);
      }
      return gym;
    };

    // 1. MEMBER GOOGLE LOGIN / AUTO-REGISTRATION
    if (userRole === 'Member') {
      let member = await Member.findOne({ email: cleanEmail });
      const activeGym = await getActiveGym();
      const targetGymId = activeGym._id.toString();

      if (!member) {
        const todayStr = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        const nextMonthStr = nextMonth.toISOString().split('T')[0];
        const randomMobile = phone || `98${Math.floor(10000000 + Math.random() * 90000000)}`;

        member = await Member.create({
          gymId: targetGymId,
          name: displayName,
          email: cleanEmail,
          mobileNo: randomMobile,
          address: 'Self-Registered via Google',
          gender: req.body.gender || 'Other',
          membershipPlan: '1 Month Plan',
          joiningDate: todayStr,
          nextBillDate: nextMonthStr,
          amountPaid: 1000,
          status: 'Active',
          profilePic: picture || '',
          googleId: googleId || '',
          authProvider: 'google',
          password: `google_member_${Date.now()}`,
          isFirstLogin: false
        });
      } else {
        if (googleId && !member.googleId) member.googleId = googleId;
        if (picture && !member.profilePic) member.profilePic = picture;
        member.authProvider = 'google';
        await member.save();
      }

      return res.json({
        success: true,
        role: 'Member',
        member: {
          id: member._id,
          _id: member._id,
          gymId: member.gymId,
          name: member.name,
          mobileNo: member.mobileNo,
          email: member.email,
          address: member.address,
          gender: member.gender,
          membershipPlan: member.membershipPlan,
          joiningDate: member.joiningDate,
          nextBillDate: member.nextBillDate,
          amountPaid: member.amountPaid,
          status: member.status,
          profilePic: member.profilePic || picture || '',
          isFirstLogin: member.isFirstLogin
        }
      });
    }

    // 2. TRAINER GOOGLE LOGIN / AUTO-REGISTRATION
    if (userRole === 'Trainer') {
      let trainer = await GymUser.findOne({ email: cleanEmail, role: 'Trainer' });
      const activeGym = await getActiveGym();
      const targetGymId = activeGym._id.toString();

      if (!trainer) {
        trainer = await GymUser.create({
          gymId: targetGymId,
          userName: displayName,
          gymName: activeGym.gymName || 'IronPulse Fitness Club',
          email: cleanEmail,
          role: 'Trainer',
          phone: phone || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          specialty: 'Personal Training & Fitness',
          profilePic: picture || '',
          googleId: googleId || '',
          authProvider: 'google',
          password: `google_trainer_${Date.now()}`,
          isFirstLogin: false
        });
      } else {
        if (googleId && !trainer.googleId) trainer.googleId = googleId;
        if (picture && !trainer.profilePic) trainer.profilePic = picture;
        trainer.authProvider = 'google';
        await trainer.save();
      }

      return res.json({
        success: true,
        role: 'Trainer',
        isFirstLogin: trainer.isFirstLogin,
        user: {
          id: trainer._id,
          _id: trainer._id,
          gymId: trainer.gymId || trainer._id.toString(),
          userName: trainer.userName,
          gymName: trainer.gymName,
          email: trainer.email,
          role: trainer.role,
          phone: trainer.phone,
          specialty: trainer.specialty,
          profilePic: trainer.profilePic || picture || '',
          isFirstLogin: trainer.isFirstLogin
        }
      });
    }

    // 3. ADMIN GOOGLE LOGIN / AUTO-REGISTRATION
    let adminUser = await GymUser.findOne({ email: cleanEmail, role: 'Admin' });

    if (!adminUser) {
      const effectiveGymName = (gymName && gymName.trim()) || `${displayName}'s Fitness Club`;
      adminUser = await GymUser.create({
        userName: displayName,
        gymName: effectiveGymName,
        email: cleanEmail,
        password: `google_auth_${Date.now()}`,
        role: 'Admin',
        profilePic: picture || '',
        googleId: googleId || '',
        authProvider: 'google',
        isFirstLogin: false
      });

      const newGymId = adminUser._id.toString();

      await Membership.create([
        { gymId: newGymId, title: '1 Month Plan', months: 1, price: 1000, description: 'Standard monthly gym access & general cardio' },
        { gymId: newGymId, title: '3 Months Plan', months: 3, price: 2500, description: 'Quarterly training with free locker facility' },
        { gymId: newGymId, title: '6 Months Plan', months: 6, price: 4500, description: 'Half-yearly package with trainer guidance' },
        { gymId: newGymId, title: '1 Year Plan', months: 12, price: 8000, description: 'Annual VIP package with free protein shakes' }
      ]);
    } else {
      if (googleId && !adminUser.googleId) {
        adminUser.googleId = googleId;
        adminUser.authProvider = 'google';
      }
      if (picture && !adminUser.profilePic) {
        adminUser.profilePic = picture;
      }
      await adminUser.save();
    }

    return res.json({
      success: true,
      role: 'Admin',
      user: {
        id: adminUser._id,
        _id: adminUser._id,
        gymId: adminUser.gymId || adminUser._id.toString(),
        userName: adminUser.userName,
        gymName: adminUser.gymName,
        email: adminUser.email,
        role: adminUser.role,
        phone: adminUser.phone,
        specialty: adminUser.specialty,
        profilePic: adminUser.profilePic || picture || ''
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// FORGOT PASSWORD (REQUEST 6-DIGIT OTP VIA EMAIL)
// -------------------------------------------------------------
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email, role, targetEmail: providedEmail } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address or mobile number' });
    }

    const input = email.trim();
    const isEmail = input.includes('@');

    let recipientName = 'User';
    let userRole = role || 'Member';
    let targetEmail = '';

    if (isEmail) {
      const cleanEmail = input.toLowerCase();

      // Look up in GymUser or Member
      const gymUser = await GymUser.findOne({ email: cleanEmail });
      const member = await Member.findOne({ email: cleanEmail });

      if (gymUser) {
        recipientName = gymUser.userName;
        userRole = gymUser.role;
        targetEmail = gymUser.email;
      } else if (member) {
        recipientName = member.name;
        userRole = 'Member';
        targetEmail = member.email;
      } else {
        // Universal access: allow new users to receive OTP and set password
        recipientName = cleanEmail.split('@')[0];
        userRole = role || 'Admin';
        targetEmail = cleanEmail;
      }
    } else {
      // Lookup by mobile / phone
      const member = await Member.findOne({ mobileNo: input });
      const gymUser = await GymUser.findOne({ phone: input });

      if (member) {
        recipientName = member.name;
        userRole = 'Member';

        if (member.email && member.email.includes('@')) {
          targetEmail = member.email;
        } else if (providedEmail && providedEmail.includes('@')) {
          member.email = providedEmail.toLowerCase().trim();
          await member.save();
          targetEmail = member.email;
        } else {
          return res.json({
            success: false,
            requiresEmail: true,
            message: `Account found for ${member.name}, but no email address is linked. Please provide your Google email address below to receive the OTP.`
          });
        }
      } else if (gymUser) {
        recipientName = gymUser.userName;
        userRole = gymUser.role;
        targetEmail = gymUser.email;
      } else {
        return res.status(404).json({
          success: false,
          message: `No registered account found with mobile number "${input}". Please check your number or enter your Google email address.`
        });
      }
    }

    const cleanEmail = targetEmail.toLowerCase().trim();

    // Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Remove any previous active OTPs for this email and input
    await Otp.deleteMany({
      $or: [
        { email: cleanEmail },
        { email: input.toLowerCase() }
      ]
    });

    // Store new OTP in DB
    await Otp.create({
      email: cleanEmail,
      otp: otpCode,
      role: userRole,
      expiresAt
    });

    // If input was a mobile number, also save alias OTP record for mobile lookup
    if (!isEmail) {
      await Otp.create({
        email: input.toLowerCase(),
        otp: otpCode,
        role: userRole,
        expiresAt
      });
    }

    // Send email via nodemailer service
    const emailResult = await sendOtpEmail(cleanEmail, otpCode, recipientName);

    res.json({
      success: true,
      message: `A 6-digit OTP has been sent to ${cleanEmail}. Please enter it below to set your new password.`,
      email: cleanEmail,
      role: userRole,
      devOtp: otpCode,
      emailSent: emailResult?.sent || false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// RESET PASSWORD WITH OTP VERIFICATION
// -------------------------------------------------------------
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email/Mobile, OTP code, and new password are required' });
    }

    const cleanInput = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    if (newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'New password must be at least 3 characters long' });
    }

    // Find valid OTP record by email, mobile, or OTP code
    let otpRecord = await Otp.findOne({ email: cleanInput, otp: cleanOtp });
    if (!otpRecord) {
      otpRecord = await Otp.findOne({ otp: cleanOtp });
    }

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code. Please double-check and try again.' });
    }

    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteMany({ otp: cleanOtp });
      return res.status(400).json({ success: false, message: 'OTP code has expired. Please request a new OTP.' });
    }

    let passwordUpdated = false;

    // 1. Update GymUser (by email, phone, or OTP email)
    const gymUser = await GymUser.findOne({
      $or: [
        { email: cleanInput },
        { email: otpRecord.email },
        { phone: cleanInput }
      ]
    });
    if (gymUser) {
      gymUser.password = newPassword.trim();
      gymUser.isFirstLogin = false;
      await gymUser.save();
      passwordUpdated = true;
    }

    // 2. Update Member (by email, mobile, or OTP email)
    const member = await Member.findOne({
      $or: [
        { email: cleanInput },
        { email: otpRecord.email },
        { mobileNo: cleanInput }
      ]
    });
    if (member) {
      member.password = newPassword.trim();
      member.isFirstLogin = false;
      if (!member.email && otpRecord.email.includes('@')) {
        member.email = otpRecord.email;
      }
      await member.save();
      passwordUpdated = true;
    }

    // 3. If account was not in DB yet (new user activating via OTP flow)
    if (!passwordUpdated) {
      const targetRole = otpRecord.role || 'Admin';
      const userEmail = cleanInput.includes('@') ? cleanInput : otpRecord.email;

      if (targetRole === 'Member') {
        const defaultGym = await GymUser.findOne({ role: 'Admin' });
        await Member.create({
          gymId: defaultGym ? defaultGym._id.toString() : 'gym_primary',
          name: userEmail.split('@')[0],
          email: userEmail,
          mobileNo: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          address: 'Self-Registered via OTP',
          gender: 'Other',
          membershipPlan: '1 Month Plan',
          joiningDate: new Date().toISOString().split('T')[0],
          nextBillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          amountPaid: 1000,
          status: 'Active',
          password: newPassword.trim(),
          isFirstLogin: false
        });
        passwordUpdated = true;
      } else if (targetRole === 'Trainer') {
        const defaultGym = await GymUser.findOne({ role: 'Admin' });
        await GymUser.create({
          gymId: defaultGym ? defaultGym._id.toString() : 'gym_primary',
          userName: userEmail.split('@')[0],
          gymName: defaultGym ? defaultGym.gymName : 'IronPulse Fitness Club',
          email: userEmail,
          role: 'Trainer',
          password: newPassword.trim(),
          isFirstLogin: false
        });
        passwordUpdated = true;
      } else {
        const newGym = await GymUser.create({
          userName: userEmail.split('@')[0],
          gymName: `${userEmail.split('@')[0]}'s Fitness Club`,
          email: userEmail,
          role: 'Admin',
          password: newPassword.trim(),
          isFirstLogin: false
        });
        await Membership.create([
          { gymId: newGym._id.toString(), title: '1 Month Plan', months: 1, price: 1000, description: 'Standard monthly gym access' },
          { gymId: newGym._id.toString(), title: '3 Months Plan', months: 3, price: 2500, description: 'Quarterly training with free locker' },
          { gymId: newGym._id.toString(), title: '6 Months Plan', months: 6, price: 4500, description: 'Half-yearly package with trainer' },
          { gymId: newGym._id.toString(), title: '1 Year Plan', months: 12, price: 8000, description: 'Annual VIP package with free protein' }
        ]);
        passwordUpdated = true;
      }
    }

    // Invalidate used OTPs
    await Otp.deleteMany({
      $or: [
        { email: cleanInput },
        { email: otpRecord.email },
        { otp: cleanOtp }
      ]
    });

    res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Profile (Profile pic, name, gym name, phone)
app.put('/api/auth/profile', async (req, res) => {
  try {
    const gymId = getGymId(req) || req.body.id || req.body._id;
    if (!gymId) {
      return res.status(400).json({ success: false, message: 'Gym/User ID is required' });
    }

    const { userName, gymName, phone, specialty, profilePic } = req.body;
    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (gymName !== undefined) updateData.gymName = gymName;
    if (phone !== undefined) updateData.phone = phone;
    if (specialty !== undefined) updateData.specialty = specialty;
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    const updated = await GymUser.findByIdAndUpdate(gymId, updateData, { returnDocument: 'after' });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        gymId: updated._id.toString(),
        userName: updated.userName,
        gymName: updated.gymName,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        specialty: updated.specialty,
        profilePic: updated.profilePic || ''
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin / User Change Password
app.put('/api/auth/password', async (req, res) => {
  try {
    const gymId = getGymId(req) || req.body.id || req.body._id;
    if (!gymId) {
      return res.status(400).json({ success: false, message: 'User / Admin ID is required' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'New password must be at least 3 characters long' });
    }

    const user = await GymUser.findById(gymId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin account not found' });
    }

    // Verify current password if user has one
    if (user.password) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required' });
      }
      if (user.password !== currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }
    }

    user.password = newPassword.trim();
    user.isFirstLogin = false;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully! You can now log in with your new password.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// TRAINER MANAGEMENT (Admin Add/List Trainers & Trainer Profile/Password)
// -------------------------------------------------------------
app.get('/api/trainers', async (req, res) => {
  try {
    const gymId = getGymId(req);
    const filter = { role: 'Trainer' };
    if (gymId) filter.gymId = gymId;
    const trainers = await GymUser.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/trainers', async (req, res) => {
  try {
    const gymId = getGymId(req);
    if (!gymId) {
      return res.status(400).json({ success: false, message: 'Gym ID is required' });
    }

    const { userName, email, phone, specialty, profilePic } = req.body;
    if (!userName || !email) {
      return res.status(400).json({ success: false, message: 'Trainer name and email are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await GymUser.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const gymOwner = await GymUser.findById(gymId);
    const gymName = gymOwner ? gymOwner.gymName : 'Gym';
    const trainerName = userName.trim();

    const newTrainer = await GymUser.create({
      gymId,
      userName: trainerName,
      gymName,
      email: cleanEmail,
      password: trainerName, // Default password is the trainer's name
      role: 'Trainer',
      phone: phone ? phone.trim() : '',
      specialty: specialty ? specialty.trim() : 'Fitness & Strength Coach',
      profilePic: profilePic || '',
      isFirstLogin: true
    });

    res.json({
      success: true,
      message: `Trainer ${trainerName} registered! Initial password is '${trainerName}'`,
      data: newTrainer
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/trainers/:id', async (req, res) => {
  try {
    const deleted = await GymUser.findOneAndDelete({ _id: req.params.id, role: 'Trainer' });
    if (!deleted) return res.status(404).json({ success: false, message: 'Trainer not found' });
    res.json({ success: true, message: 'Trainer removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/trainers/:id/profile', async (req, res) => {
  try {
    const { userName, phone, specialty, profilePic } = req.body;
    const updateData = {};
    if (userName !== undefined) updateData.userName = userName.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (specialty !== undefined) updateData.specialty = specialty.trim();
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    const updated = await GymUser.findOneAndUpdate(
      { _id: req.params.id, role: 'Trainer' },
      updateData,
      { returnDocument: 'after' }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Trainer not found' });

    res.json({
      success: true,
      message: 'Trainer profile updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/trainers/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'New password must be at least 3 characters long' });
    }

    const trainer = await GymUser.findOne({ _id: req.params.id, role: 'Trainer' });
    if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

    if (currentPassword) {
      const matchPass = trainer.password && trainer.password === currentPassword;
      const matchName = trainer.userName && trainer.userName.toLowerCase().trim() === currentPassword.toLowerCase().trim();
      if (!matchPass && !matchName) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }
    }

    trainer.password = newPassword.trim();
    trainer.isFirstLogin = false;
    await trainer.save();

    res.json({
      success: true,
      message: 'Password changed successfully! You can now log in with your new password.',
      isFirstLogin: false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 2. DASHBOARD STATS (Scoped to Gym)
// -------------------------------------------------------------
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    await checkAndUpdateExpiredStatus();
    const gymId = getGymId(req);
    const filter = gymId ? { gymId } : {};

    const totalMembers = await Member.countDocuments(filter);
    const activeMembers = await Member.countDocuments({ ...filter, status: 'Active' });
    const expiredMembers = await Member.countDocuments({ ...filter, status: 'Expired' });

    const matchStage = gymId ? [{ $match: { gymId } }] : [];
    const revenueAgg = await Member.aggregate([
      ...matchStage,
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const recentMembers = await Member.find(filter).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      stats: {
        totalMembers,
        activeMembers,
        expiredMembers,
        totalRevenue
      },
      recentMembers
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. MEMBERS MANAGEMENT (Scoped to Gym)
// -------------------------------------------------------------
app.get('/api/members', async (req, res) => {
  try {
    await checkAndUpdateExpiredStatus();

    const gymId = getGymId(req);
    const { search, status } = req.query;
    const query = {};
    if (gymId) {
      query.gymId = gymId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const s = search.trim();
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { mobileNo: { $regex: s, $options: 'i' } },
        { membershipPlan: { $regex: s, $options: 'i' } }
      ];
    }

    const members = await Member.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/members', async (req, res) => {
  try {
    const gymId = getGymId(req) || req.body.gymId;
    if (!gymId) {
      return res.status(400).json({ success: false, message: 'Gym ID is required to register a member' });
    }

    const {
      name,
      memberName: altName,
      mobileNo,
      email,
      password,
      address,
      gender,
      joiningDate,
      membershipPlan,
      membershipMonths,
      amountPaid,
      profilePic
    } = req.body;

    const memberName = (name || altName || '').trim();
    if (!memberName || !mobileNo || !membershipPlan) {
      return res.status(400).json({ success: false, message: 'Name, mobile number, and membership plan are required' });
    }

    const joinDateObj = joiningDate ? new Date(joiningDate) : new Date();
    const joinDateStr = joinDateObj.toISOString().split('T')[0];
    const monthsToAdd = Number(membershipMonths) || 1;

    // Calculate next bill date
    const nextBillObj = new Date(joinDateObj);
    nextBillObj.setMonth(nextBillObj.getMonth() + monthsToAdd);
    const nextBillDateStr = nextBillObj.toISOString().split('T')[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const status = nextBillDateStr < todayStr ? 'Expired' : 'Active';

    // Default password for first time login is the member's name
    const defaultPassword = password && password.trim() ? password.trim() : memberName;

    const newMember = await Member.create({
      gymId,
      name: memberName,
      mobileNo,
      email: email || '',
      password: defaultPassword,
      isFirstLogin: true,
      address: address || '',
      gender: gender || 'Male',
      joiningDate: joinDateStr,
      membershipPlan,
      membershipMonths: monthsToAdd,
      nextBillDate: nextBillDateStr,
      amountPaid: Number(amountPaid) || 0,
      status,
      profilePic: profilePic || ''
    });

    res.json({ success: true, data: newMember, message: 'Member added successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Self-Profile Update (Photo, Name, Phone, Email, Address, Gender)
app.put('/api/members/:id/profile', async (req, res) => {
  try {
    const { name, mobileNo, email, address, gender, profilePic } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (mobileNo !== undefined) updateData.mobileNo = mobileNo.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (address !== undefined) updateData.address = address.trim();
    if (gender !== undefined) updateData.gender = gender;
    if (profilePic !== undefined) updateData.profilePic = profilePic;

    const updated = await Member.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ success: false, message: 'Member not found' });

    // Sync memberName and profilePic in attendance records
    if (name || profilePic !== undefined) {
      const attUpdate = {};
      if (name) attUpdate.memberName = name.trim();
      if (profilePic !== undefined) attUpdate.profilePic = profilePic;
      await Attendance.updateMany({ memberId: updated._id }, { $set: attUpdate });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Member Change Password (first login or anytime)
app.put('/api/members/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'New password must be at least 3 characters long' });
    }

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    // If currentPassword is provided, verify it (match current password OR member's name)
    if (currentPassword) {
      const matchPass = member.password && member.password === currentPassword;
      const matchName = member.name.toLowerCase().trim() === currentPassword.toLowerCase().trim();
      if (!matchPass && !matchName) {
        return res.status(400).json({ success: false, message: 'Current password does not match' });
      }
    }

    member.password = newPassword.trim();
    member.isFirstLogin = false;
    await member.save();

    res.json({
      success: true,
      message: 'Password changed successfully! You can now log in with your new password.',
      isFirstLogin: false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/members/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: updated, message: 'Member updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  try {
    const deleted = await Member.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Member not found' });
    // Also remove attendance records for this member
    await Attendance.deleteMany({ memberId: req.params.id });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Renew Member Membership
app.put('/api/members/:id/renew', async (req, res) => {
  try {
    const { membershipPlan, membershipMonths, amountPaid } = req.body;
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const monthsToAdd = Number(membershipMonths) || member.membershipMonths || 1;
    const planTitle = membershipPlan || member.membershipPlan;

    // Calculate new expiration date from today
    const now = new Date();
    now.setMonth(now.getMonth() + monthsToAdd);
    const newBillDate = now.toISOString().split('T')[0];

    member.membershipPlan = planTitle;
    member.membershipMonths = monthsToAdd;
    member.nextBillDate = newBillDate;
    member.status = 'Active';
    if (amountPaid) {
      member.amountPaid += Number(amountPaid);
    }
    await member.save();

    res.json({ success: true, data: member, message: `Membership renewed until ${newBillDate}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 4. MEMBERSHIP PLANS (Scoped to Gym)
// -------------------------------------------------------------
app.get('/api/memberships', async (req, res) => {
  try {
    const gymId = getGymId(req);
    const filter = gymId ? { gymId } : {};
    const memberships = await Membership.find(filter).sort({ months: 1 });
    res.json({ success: true, data: memberships });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/memberships', async (req, res) => {
  try {
    const gymId = getGymId(req);
    if (!gymId) {
      return res.status(400).json({ success: false, message: 'Gym ID is required' });
    }

    const { title, months, price, description } = req.body;
    if (!title || !months || !price) {
      return res.status(400).json({ success: false, message: 'Title, months, and price are required' });
    }

    const newPlan = await Membership.create({
      gymId,
      title,
      months: Number(months),
      price: Number(price),
      description: description || ''
    });

    res.json({ success: true, data: newPlan, message: 'Membership plan created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 5. ATTENDANCE & LIVE FLOOR OCCUPANCY (Scoped to Gym)
// -------------------------------------------------------------

// Get today's attendance & stats
app.get('/api/attendance/today', async (req, res) => {
  try {
    const gymId = getGymId(req);
    const todayStr = new Date().toISOString().split('T')[0];
    const filter = { date: todayStr };
    if (gymId) filter.gymId = gymId;

    const records = await Attendance.find(filter).sort({ createdAt: -1 });
    const totalToday = records.length;
    const currentlyInside = records.filter((r) => r.status === 'In Gym').length;
    const completedToday = records.filter((r) => r.status === 'Completed').length;

    res.json({
      success: true,
      stats: {
        totalToday,
        currentlyInside,
        completedToday
      },
      data: records
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fast Check-In
app.post('/api/attendance/check-in', async (req, res) => {
  try {
    const gymId = getGymId(req);
    const { memberId } = req.body;
    if (!memberId) {
      return res.status(400).json({ success: false, message: 'Member ID is required for check-in' });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Check if member is already checked in and still inside
    const activeEntry = await Attendance.findOne({
      memberId: member._id,
      date: todayStr,
      status: 'In Gym'
    });

    if (activeEntry) {
      return res.status(400).json({
        success: false,
        message: `${member.name} is already checked in today (at ${activeEntry.timeIn})!`
      });
    }

    const timeIn = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newRecord = await Attendance.create({
      gymId: member.gymId || gymId,
      memberId: member._id,
      memberName: member.name,
      mobileNo: member.mobileNo,
      membershipPlan: member.membershipPlan,
      profilePic: member.profilePic || '',
      date: todayStr,
      timeIn,
      status: 'In Gym'
    });

    res.json({
      success: true,
      data: newRecord,
      message: `${member.name} checked in successfully at ${timeIn}!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Check-Out
app.post('/api/attendance/check-out', async (req, res) => {
  try {
    const { attendanceId } = req.body;
    if (!attendanceId) {
      return res.status(400).json({ success: false, message: 'Attendance ID is required for check-out' });
    }

    const record = await Attendance.findById(attendanceId);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    if (record.status === 'Completed') {
      return res.status(400).json({ success: false, message: 'Member is already checked out' });
    }

    const timeOut = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    record.timeOut = timeOut;
    record.status = 'Completed';
    await record.save();

    res.json({
      success: true,
      data: record,
      message: `${record.memberName} checked out at ${timeOut}!`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Attendance History & Logs with optional date & search filter
app.get('/api/attendance/history', async (req, res) => {
  try {
    const gymId = getGymId(req);
    const { date, search } = req.query;
    const query = {};
    if (gymId) query.gymId = gymId;
    if (date) query.date = date;
    if (search) {
      query.$or = [
        { memberName: new RegExp(search, 'i') },
        { mobileNo: new RegExp(search, 'i') }
      ];
    }

    const records = await Attendance.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete attendance record
app.delete('/api/attendance/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Attendance entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'CodingHunger MERN Gym Multi-Role' });
});

// Catch-all for any undefined API routes - ALWAYS return JSON, never HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Serve frontend React build in production (e.g. Render unified service)
const frontendBuildPath = path.join(__dirname, '../gms-frontened/build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // If running standalone backend, return JSON status on root
  app.get('/', (req, res) => {
    res.json({
      success: true,
      status: 'online',
      message: 'Multi-Role Gym Backend API is running successfully',
      health: '/api/health'
    });
  });
}

// Global JSON error handler middleware (prevents Express HTML stack trace responses)
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


const server = app.listen(PORT, () => {
  console.log(`🚀 Multi-Role Gym Backend API running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️ Port ${PORT} is already in use. Another backend server process is currently running.`);
  } else {
    console.error('❌ Server error:', err.message);
  }
});
