import React, { useState } from 'react';
import { authAPI } from '../../services/api';

export const GoogleSignInModal = ({ isOpen, onClose, selectedRole = 'Admin', onLoginSuccess }) => {
  const [mode, setMode] = useState('picker'); // 'picker' | 'custom'
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customGymName, setCustomGymName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Preset Google Accounts tailored for quick 1-click test
  const presetGoogleAccounts = [
    {
      name: selectedRole === 'Admin' ? 'Alex Mercer' : selectedRole === 'Trainer' ? 'Coach Vikram' : 'Rahul Sharma',
      email: selectedRole === 'Admin' ? 'admin@gym.com' : selectedRole === 'Trainer' ? 'trainer@gym.com' : 'rahul@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      subtitle: `${selectedRole} Account`
    },
    {
      name: 'Priya Patel',
      email: 'priya@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      subtitle: 'Member Account'
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      subtitle: 'Google Workspace Account'
    }
  ];

  const handleSelectAccount = async (account) => {
    setLoading(true);
    setErrorMsg('');

    const payload = {
      email: account.email,
      name: account.name,
      picture: account.avatar || '',
      googleId: 'google_' + Math.abs(account.email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
      role: selectedRole,
      gymName: customGymName || `${account.name}'s Fitness Club`,
      phone: account.phone || customPhone || ''
    };

    const res = await authAPI.googleLogin(payload);
    setLoading(false);

    if (res.success) {
      const userPayload = selectedRole === 'Member' ? res.member : res.user;
      localStorage.setItem('gym_app_user', JSON.stringify({ ...userPayload, role: res.role }));
      onLoginSuccess(userPayload, res.role);
      onClose();
    } else {
      setErrorMsg(res.message || 'Google authentication failed.');
    }
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }

    const account = {
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
    };

    await handleSelectAccount(account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            {/* Google G Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-black text-slate-900">Sign in with Google</h3>
              <p className="text-[10px] text-slate-500">Choose an account for {selectedRole} Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors text-xs"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* MODE 1: CHOOSE PRESET OR ANOTHER GOOGLE ACCOUNT */}
        {mode === 'picker' && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600 mb-2">Select Google Account:</p>
            {presetGoogleAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 border border-slate-200/90 transition-all text-left group hover:border-cyan-400"
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="flex-1 truncate">
                  <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-700 truncate">
                    {acc.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{acc.subtitle}</span>
              </button>
            ))}

            <button
              type="button"
              disabled={loading}
              onClick={() => { setMode('custom'); setErrorMsg(''); }}
              className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-dashed border-slate-300 text-slate-600 hover:text-cyan-700 hover:border-cyan-400 text-xs font-bold transition-all mt-2"
            >
              <span>+</span>
              <span>Use another Google account</span>
            </button>
          </div>
        )}

        {/* MODE 2: CUSTOM GOOGLE ACCOUNT FORM */}
        {mode === 'custom' && (
          <form onSubmit={handleCustomSubmit} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Google Email Address *</label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {selectedRole === 'Admin' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gym Name (If registering fresh)</label>
                <input
                  type="text"
                  value={customGymName}
                  onChange={(e) => setCustomGymName(e.target.value)}
                  placeholder="e.g. PowerGym Fitness"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            )}

            {(selectedRole === 'Member' || selectedRole === 'Trainer') && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile / Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            )}

            <div className="pt-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setMode('picker')}
                className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all disabled:opacity-60"
              >
                {loading ? 'Signing In...' : 'Continue →'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Protected by Google OAuth • One-Click Access
          </p>
        </div>
      </div>
    </div>
  );
};
