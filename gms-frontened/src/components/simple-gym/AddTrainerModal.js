import React, { useState } from 'react';
import { trainersAPI } from '../../services/api';
import { PhotoAvatarSelector } from '../common/PhotoAvatarSelector';

export const AddTrainerModal = ({ isOpen, onClose, onTrainerAdded }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('Strength & Conditioning');
  const [profilePic, setProfilePic] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await trainersAPI.create({
      userName: userName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      profilePic
    });

    setLoading(false);
    if (res.success) {
      onTrainerAdded(res.data);
      onClose();
      // Reset form
      setUserName('');
      setEmail('');
      setPhone('');
      setSpecialty('Strength & Conditioning');
      setProfilePic('');
    } else {
      setErrorMsg(res.message || 'Failed to add trainer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl">
              🏋️‍♂️
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Add Gym Trainer</h3>
              <p className="text-xs text-slate-500">Register a new fitness coach for your gym</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Notice on first-time login password */}
        <div className="mt-4 p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200 text-cyan-900 text-xs flex items-start space-x-2.5">
          <span className="text-base">ℹ️</span>
          <div>
            <strong>Trainer Login Password:</strong> The trainer's initial login password will automatically be their <strong>Full Name</strong>. On their first login, they will be prompted to create their own secure password.
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Trainer Photo / Avatar */}
          <PhotoAvatarSelector
            label="Trainer Photo (Optional - Upload or Choose Avatar)"
            value={profilePic}
            onChange={(pic) => setProfilePic(pic)}
          />

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Trainer Full Name *</label>
            <input
              type="text"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Coach Vikram Singh"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address (Login ID) *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trainer@gym.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile / Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Specialty / Discipline</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              <option value="Strength & Conditioning">Strength & Conditioning</option>
              <option value="Hypertrophy & Bodybuilding">Hypertrophy & Bodybuilding</option>
              <option value="CrossFit & Functional Training">CrossFit & Functional Training</option>
              <option value="Cardio & Fat Loss">Cardio & Fat Loss</option>
              <option value="Yoga, Mobility & Flexibility">Yoga, Mobility & Flexibility</option>
              <option value="Boxing & Kickboxing">Boxing & Kickboxing</option>
              <option value="General Fitness Trainer">General Fitness Trainer</option>
            </select>
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
              {loading ? 'Adding Trainer...' : 'Confirm & Add Trainer →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
