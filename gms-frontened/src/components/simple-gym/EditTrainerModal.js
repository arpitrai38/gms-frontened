import React, { useState, useEffect } from 'react';
import { trainersAPI } from '../../services/api';
import { PhotoAvatarSelector } from '../common/PhotoAvatarSelector';

const PRESET_SPECIALTIES = [
  'Strength & Conditioning',
  'CrossFit & Functional',
  'Bodybuilding & Hypertrophy',
  'Yoga & Mobility',
  'HIIT & Fat Loss',
  'Powerlifting & Olympic Lifts',
  'Personal Fitness Trainer'
];

export const EditTrainerModal = ({ isOpen, onClose, trainer, onTrainerUpdated }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Strength & Conditioning');
  const [profilePic, setProfilePic] = useState('');

  // Password reset option for Admin
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (trainer && isOpen) {
      setUserName(trainer.userName || '');
      setEmail(trainer.email || '');
      setPhone(trainer.phone || '');
      setSpecialty(trainer.specialty || 'Strength & Conditioning');
      setProfilePic(trainer.profilePic || '');
      setChangePassword(false);
      setNewPassword('');
      setShowPassword(false);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [trainer, isOpen]);

  if (!isOpen || !trainer) return null;

  const cleanedPhone = phone.replace(/\D/g, '').slice(0, 10);
  const isPhoneValid = !phone || cleanedPhone.length === 10;

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleResetToName = () => {
    if (userName.trim()) {
      setNewPassword(userName.trim());
      setChangePassword(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!userName.trim() || userName.trim().length < 2) {
      setErrorMsg('Trainer name must be at least 2 characters long.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (phone && cleanedPhone.length !== 10) {
      setErrorMsg('Trainer phone number must be exactly 10 digits.');
      return;
    }

    if (changePassword && (!newPassword || newPassword.trim().length < 3)) {
      setErrorMsg('New password must be at least 3 characters long.');
      return;
    }

    setLoading(true);

    const payload = {
      userName: userName.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanedPhone,
      specialty: specialty.trim(),
      profilePic
    };

    if (changePassword && newPassword.trim()) {
      payload.password = newPassword.trim();
    }

    const trainerId = trainer._id || trainer.id;
    const res = await trainersAPI.updateProfile(trainerId, payload);

    setLoading(false);

    if (res.success && res.data) {
      setSuccessMsg('Trainer profile updated successfully!');
      if (onTrainerUpdated) {
        onTrainerUpdated(res.data);
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.message || 'Failed to update trainer profile.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-cyan-100 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 mr-2">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl shrink-0 border border-cyan-200">
              ✏️
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                Edit Trainer Profile
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                Update coach credentials, contact info, and security credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors text-xs shrink-0 cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
            <span className="text-base leading-none">⚠️</span>
            <div className="font-semibold flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2">
            <span className="text-base leading-none">✓</span>
            <div className="font-semibold flex-1 leading-relaxed">{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Trainer Photo / Avatar Selector */}
          <PhotoAvatarSelector
            label="Trainer Profile Photo (Upload Image or Choose Avatar)"
            value={profilePic}
            onChange={(pic) => setProfilePic(pic)}
          />

          {/* Trainer Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Trainer Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. coach@gym.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Phone (10 Digits strictly enforced) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">
                10-Digit Mobile Number
              </label>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  phone && cleanedPhone.length === 10
                    ? 'bg-emerald-100 text-emerald-800'
                    : phone.length > 0
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cleanedPhone.length}/10 {cleanedPhone.length === 10 && '✓ Valid'}
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 font-bold text-xs select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                className="w-full pl-11 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Coaching Specialty */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Coaching Specialty <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Strength & Conditioning"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500 mb-2"
            />

            {/* Quick-select pills */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setSpecialty(spec)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    specialty === spec
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200/80'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500 w-3.5 h-3.5"
                />
                <span className="font-bold text-slate-700 text-xs">
                  Reset / Change Trainer Password
                </span>
              </label>

              {changePassword && (
                <button
                  type="button"
                  onClick={handleResetToName}
                  className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 hover:underline bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200"
                  title="Quickly set password back to Trainer Name"
                >
                  Set to Name ({userName || 'Name'})
                </button>
              )}
            </div>

            {changePassword && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-fadeIn">
                <label className="block text-[11px] font-semibold text-slate-600">
                  New Password for Trainer
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 3 characters)"
                    className="w-full px-3.5 py-2 pr-10 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  💡 Trainer can log in immediately with this updated password.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/25 transition-all disabled:opacity-60 cursor-pointer active:scale-95"
            >
              {loading ? (
                <span className="flex items-center space-x-1.5">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Saving Changes...</span>
                </span>
              ) : (
                'Save Changes →'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
