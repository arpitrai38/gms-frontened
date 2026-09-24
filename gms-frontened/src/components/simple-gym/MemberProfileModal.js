import React, { useState, useEffect } from 'react';
import { membersAPI, authAPI } from '../../services/api';
import { PhotoAvatarSelector } from '../common/PhotoAvatarSelector';

export const MemberProfileModal = ({ isOpen, onClose, memberUser, onMemberUpdated }) => {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'

  // Profile fields
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [profilePic, setProfilePic] = useState('');

  // Password fields
  const [passwordMode, setPasswordMode] = useState('current'); // 'current' | 'otp'
  const [currentPassword, setCurrentPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isFirstLogin = memberUser?.isFirstLogin !== false;

  useEffect(() => {
    if (memberUser && isOpen) {
      setName(memberUser.name || '');
      setMobileNo(memberUser.mobileNo || '');
      setEmail(memberUser.email || '');
      setAddress(memberUser.address || '');
      setGender(memberUser.gender || 'Male');
      setProfilePic(memberUser.profilePic || '');
      setCurrentPassword('');
      setOtpCode('');
      setDevOtpHint('');
      setOtpSent(false);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMode('current');
      setErrorMsg('');
      setSuccessMsg('');
      if (isFirstLogin) {
        setActiveTab('password');
      } else {
        setActiveTab('profile');
      }
    }
  }, [memberUser, isOpen, isFirstLogin]);

  if (!isOpen) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const memberId = memberUser.id || memberUser._id;
    const res = await membersAPI.updateProfile(memberId, {
      name: name.trim(),
      mobileNo: mobileNo.trim(),
      email: email.trim(),
      address: address.trim(),
      gender,
      profilePic
    });

    setLoading(false);
    if (res.success && res.data) {
      setSuccessMsg('Profile updated successfully!');
      const updated = { ...memberUser, ...res.data };
      localStorage.setItem('gym_app_user', JSON.stringify(updated));
      if (onMemberUpdated) onMemberUpdated(updated);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  const handleRequestOtp = async () => {
    const targetEmail = email || memberUser.email;
    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg('Please specify a valid email address in your profile first to receive the OTP.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = await authAPI.forgotPassword(targetEmail);
    setLoading(false);

    if (res.success) {
      setOtpSent(true);
      if (res.devOtp) setDevOtpHint(res.devOtp);
      setSuccessMsg(`OTP sent to ${targetEmail}. Please check your Google inbox.`);
    } else {
      setErrorMsg(res.message || 'Failed to send OTP to email.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newPassword || newPassword.length < 3) {
      setErrorMsg('New password must be at least 3 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setLoading(true);

    if (passwordMode === 'otp') {
      const targetEmail = email || memberUser.email;
      if (!otpCode || otpCode.trim().length !== 6) {
        setLoading(false);
        setErrorMsg('Please enter the 6-digit OTP code sent to your Google email.');
        return;
      }

      const res = await authAPI.resetPassword({
        email: targetEmail,
        otp: otpCode.trim(),
        newPassword: newPassword.trim()
      });
      setLoading(false);

      if (res.success) {
        setSuccessMsg('Password changed successfully via Google email OTP!');
        const updated = { ...memberUser, isFirstLogin: false };
        localStorage.setItem('gym_app_user', JSON.stringify(updated));
        if (onMemberUpdated) onMemberUpdated(updated);
        setTimeout(() => onClose(), 1200);
      } else {
        setErrorMsg(res.message || 'Failed to verify OTP.');
      }
    } else {
      const memberId = memberUser.id || memberUser._id;
      const res = await membersAPI.changePassword(memberId, {
        currentPassword: currentPassword || memberUser.name,
        newPassword: newPassword.trim()
      });

      setLoading(false);
      if (res.success) {
        setSuccessMsg('Password changed successfully! You can now log in with your new password.');
        const updated = { ...memberUser, isFirstLogin: false };
        localStorage.setItem('gym_app_user', JSON.stringify(updated));
        if (onMemberUpdated) onMemberUpdated(updated);
        setTimeout(() => onClose(), 1200);
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
              👤
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Member Profile Settings</h3>
              <p className="text-xs text-slate-500">Update photo, contact details & password</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* First Login Welcome Banner */}
        {isFirstLogin && (
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-200 text-cyan-900 text-xs flex items-start space-x-3">
            <span className="text-lg">🎉</span>
            <div>
              <strong className="block font-bold">First Time Login Notice:</strong>
              Your default temporary password was set to your name (<strong>{memberUser?.name}</strong>). Please create your own secure password below.
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🖼️ Profile & Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'password'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🔒 Change Password</span>
            {isFirstLogin && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
            )}
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

        {/* TAB 1: PROFILE DETAILS & PHOTO */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="mt-4 space-y-3.5 text-xs">
            <PhotoAvatarSelector
              label="Member Photo (Upload or Choose Avatar)"
              value={profilePic}
              onChange={(p) => setProfilePic(p)}
            />

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email / Google Account</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@gmail.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Apartment, Street, City"
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
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CHANGE PASSWORD */}
        {activeTab === 'password' && (
          <form onSubmit={handleUpdatePassword} className="mt-4 space-y-3.5 text-xs">
            {/* Mode switch */}
            <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-semibold text-slate-600">Verification:</span>
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
                  📧 Google OTP
                </button>
              </div>
            </div>

            {/* Mode 1: Current Password */}
            {passwordMode === 'current' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isFirstLogin ? 'Default Password (Your Name)' : 'Current Password'}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={isFirstLogin ? `e.g. ${memberUser?.name}` : 'Enter your current password'}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                {isFirstLogin && (
                  <p className="text-[10px] text-cyan-600 mt-1">
                    Tip: For first-time login, your current password is your registered name: <strong>{memberUser?.name}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Mode 2: Google Email OTP */}
            {passwordMode === 'otp' && (
              <div className="space-y-3 p-3 bg-cyan-50/50 border border-cyan-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-cyan-900">Email: {email || memberUser?.email || 'No email saved'}</p>
                    <p className="text-[10px] text-cyan-700">Click to receive a 6-digit OTP code on your Google account</p>
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
                placeholder="Enter new strong password"
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
