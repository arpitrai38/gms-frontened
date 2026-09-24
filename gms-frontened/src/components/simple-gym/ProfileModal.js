import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';
import { PhotoAvatarSelector } from '../common/PhotoAvatarSelector';

export const ProfileModal = ({ isOpen, onClose, gymUser, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile fields
  const [userName, setUserName] = useState('');
  const [gymName, setGymName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [profilePic, setProfilePic] = useState('');

  // Password fields
  const [passwordMode, setPasswordMode] = useState('current'); // 'current' | 'otp'
  const [currentPassword, setCurrentPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (gymUser && isOpen) {
      setUserName(gymUser.userName || '');
      setGymName(gymUser.gymName || '');
      setPhone(gymUser.phone || '');
      setSpecialty(gymUser.specialty || '');
      setProfilePic(gymUser.profilePic || '');
      setCurrentPassword('');
      setOtpCode('');
      setDevOtpHint('');
      setNewPassword('');
      setConfirmPassword('');
      setOtpSent(false);
      setPasswordMode('current');
      setSuccessMsg('');
      setErrorMsg('');
      setActiveTab('profile');
    }
  }, [gymUser, isOpen]);

  if (!isOpen) return null;

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const payload = {
      id: gymUser.id || gymUser._id,
      userName: userName.trim(),
      gymName: gymName.trim(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      profilePic
    };

    const res = await authAPI.updateProfile(payload);
    setLoading(false);

    if (res.success && res.user) {
      setSuccessMsg('Profile updated successfully!');
      const updated = { ...gymUser, ...res.user };
      localStorage.setItem('gym_app_user', JSON.stringify(updated));
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  // Request OTP to email for password change
  const handleRequestOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = await authAPI.forgotPassword(gymUser.email);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      if (res.devOtp) setDevOtpHint(res.devOtp);
      setSuccessMsg(`OTP sent to ${gymUser.email}. Please enter the 6-digit code below.`);
    } else {
      setErrorMsg(res.message || 'Failed to send OTP to email.');
    }
  };

  // Handle Password Update (via current password OR via OTP)
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPassword || newPassword.length < 3) {
      setErrorMsg('New password must be at least 3 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    if (passwordMode === 'otp') {
      if (!otpCode || otpCode.trim().length !== 6) {
        setLoading(false);
        setErrorMsg('Please enter the 6-digit OTP code sent to your Google/email account.');
        return;
      }

      const res = await authAPI.resetPassword({
        email: gymUser.email,
        otp: otpCode.trim(),
        newPassword: newPassword.trim()
      });
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Password changed successfully via Google email OTP!');
        setTimeout(() => onClose(), 1400);
      } else {
        setErrorMsg(res.message || 'Failed to verify OTP.');
      }
    } else {
      if (!currentPassword) {
        setLoading(false);
        setErrorMsg('Please enter your current password.');
        return;
      }

      const res = await authAPI.changePassword({
        id: gymUser.id || gymUser._id,
        currentPassword,
        newPassword: newPassword.trim()
      });
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Password changed successfully!');
        setTimeout(() => onClose(), 1400);
      } else {
        setErrorMsg(res.message || 'Failed to update password.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl">
              ⚙️
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Admin Account Settings</h3>
              <p className="text-xs text-slate-500">Manage profile photo, gym info & password</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🖼️ Gym & Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'password'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🔒 Change Password
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-xs">
            ✓ {successMsg}
          </div>
        )}

        {/* TAB 1: PROFILE & GYM DETAILS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4 text-xs">
            <PhotoAvatarSelector
              label="Gym Owner / Admin Profile Photo"
              value={profilePic}
              onChange={(newPic) => setProfilePic(newPic)}
            />

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gym Name *</label>
              <input
                type="text"
                required
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                placeholder="e.g. IronPulse Fitness Club"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Owner / Admin Name *</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email (Read Only)</label>
                <input
                  type="text"
                  readOnly
                  value={gymUser?.email || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'password' && (
          <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4 text-xs">
            {/* Password verification mode switch */}
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-600">Verification Method:</span>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => { setPasswordMode('current'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    passwordMode === 'current'
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Current Password
                </button>
                <button
                  type="button"
                  onClick={() => { setPasswordMode('otp'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    passwordMode === 'otp'
                      ? 'bg-cyan-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📧 Google / Email OTP
                </button>
              </div>
            </div>

            {/* Mode 1: Current Password */}
            {passwordMode === 'current' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            )}

            {/* Mode 2: OTP Verification */}
            {passwordMode === 'otp' && (
              <div className="space-y-3 p-3 bg-cyan-50/50 border border-cyan-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-cyan-900">Email: {gymUser?.email}</p>
                    <p className="text-[10px] text-cyan-700">Click to receive a 6-digit OTP code on your Google email</p>
                  </div>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleRequestOtp}
                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-xs transition-all"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                {devOtpHint && (
                  <div className="p-2 bg-white border border-cyan-300 rounded-xl text-[11px] flex items-center justify-between text-cyan-900">
                    <span>⚡ Testing OTP: <strong>{devOtpHint}</strong></span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(devOtpHint)}
                      className="text-cyan-600 underline font-bold"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                {otpSent && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit OTP *</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-center text-base font-bold font-mono tracking-widest text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (minimum 3 characters)"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all disabled:opacity-60"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
