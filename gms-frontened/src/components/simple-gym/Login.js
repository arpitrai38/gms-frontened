import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { GoogleSignInModal } from './GoogleSignInModal';

export const Login = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'Trainer' | 'Member'
  const [isRegister, setIsRegister] = useState(false);

  // Form states
  const [emailOrMobile, setEmailOrMobile] = useState('admin@gym.com');
  const [password, setPassword] = useState('admin123');
  const [userName, setUserName] = useState('');
  const [gymName, setGymName] = useState('');
  const [phone, setPhone] = useState('');

  // Modals state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Quick 1-Click Demo Fill
  const fillDemo = (role) => {
    setSelectedRole(role);
    setIsRegister(false);
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'Admin') {
      setEmailOrMobile('admin@gym.com');
      setPassword('admin123');
    } else if (role === 'Trainer') {
      setEmailOrMobile('trainer@gym.com');
      setPassword('trainer123');
    } else if (role === 'Member') {
      setEmailOrMobile('9876543210');
      setPassword('Rahul Sharma');
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIsRegister(false);
    fillDemo(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (isRegister) {
      const res = await authAPI.register({ userName, gymName, email: emailOrMobile, password, phone });
      setLoading(false);
      if (res.success && res.user) {
        localStorage.setItem('gym_app_user', JSON.stringify({ ...res.user, role: 'Admin' }));
        onLoginSuccess(res.user, 'Admin');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } else {
      const res = await authAPI.login(emailOrMobile, password, selectedRole);
      setLoading(false);
      if (res.success) {
        const payload = selectedRole === 'Member' ? res.member : res.user;
        localStorage.setItem('gym_app_user', JSON.stringify({ ...payload, role: res.role }));
        onLoginSuccess(payload, res.role);
      } else {
        setErrorMsg(res.message || 'Invalid credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F8FA] via-[#F4FBFB] to-[#E0F2FE] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-cyan-100 rounded-3xl p-8 shadow-2xl shadow-cyan-900/10 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-500/25 mb-3">
            🏋️
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">GYM MANAGEMENT</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Multi-Role Portal (Admin, Trainer & Member)</p>
        </div>

        {/* 1-Click Quick Demo Pill */}
        <div className="mb-5 p-2.5 bg-cyan-50/70 border border-cyan-100 rounded-2xl flex items-center justify-between">
          <span className="text-[11px] text-cyan-800 font-bold pl-1">⚡ Quick Demo:</span>
          <div className="flex space-x-1.5">
            <button
              type="button"
              onClick={() => fillDemo('Admin')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedRole === 'Admin' && !isRegister
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm shadow-cyan-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-cyan-700 hover:border-cyan-200'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('Trainer')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedRole === 'Trainer' && !isRegister
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm shadow-cyan-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-cyan-700 hover:border-cyan-200'
              }`}
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('Member')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedRole === 'Member' && !isRegister
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm shadow-cyan-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-cyan-700 hover:border-cyan-200'
              }`}
            >
              Member
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80 mb-5">
          <button
            type="button"
            onClick={() => handleRoleChange('Admin')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              selectedRole === 'Admin' && !isRegister
                ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Trainer')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              selectedRole === 'Trainer' && !isRegister
                ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🏋️ Trainer
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Member')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              selectedRole === 'Member' && !isRegister
                ? 'bg-white text-cyan-800 shadow-sm border border-cyan-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            👤 Member
          </button>
        </div>

        {/* Option for Admin to Register New Gym */}
        {selectedRole === 'Admin' && (
          <div className="flex justify-end mb-3">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 hover:underline"
            >
              {isRegister ? '← Back to Sign In' : '+ Register New Gym'}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-xs">
            ✓ {successMsg}
          </div>
        )}

        {/* Google One-Click Login Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:border-cyan-300 hover:bg-slate-50/80 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-center space-x-2.5 shadow-xs group"
          >
            {/* Authentic Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span className="group-hover:text-cyan-800">
              {isRegister ? 'Register with Google' : `Continue with Google as ${selectedRole}`}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
            or with credentials
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gym Name</label>
                <input
                  type="text"
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="e.g. IronPulse Fitness"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {selectedRole === 'Member' ? 'Mobile Number / Email' : 'Email Address'}
            </label>
            <input
              type="text"
              required
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              placeholder={
                selectedRole === 'Member'
                  ? '9876543210 or rahul@gmail.com'
                  : selectedRole === 'Trainer'
                  ? 'trainer@gym.com'
                  : 'admin@gym.com'
              }
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-bold text-cyan-600 hover:text-cyan-800 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                (selectedRole === 'Member' || selectedRole === 'Trainer')
                  ? 'e.g. Your Registered Name'
                  : '••••••••'
              }
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />

            {(selectedRole === 'Member' || selectedRole === 'Trainer') && !isRegister && (
              <p className="text-[10px] text-cyan-700 font-bold mt-1">
                Tip: For first-time login, your initial password is your registered Name.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-60 mt-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading
              ? 'Authenticating...'
              : isRegister
              ? 'Create Gym Account →'
              : `Sign In as ${selectedRole} →`}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Multi-Role Gym Management System • Powered by MongoDB
        </p>
      </div>

      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={emailOrMobile.includes('@') ? emailOrMobile : ''}
        initialRole={selectedRole}
        onPasswordResetSuccess={(resetEmail, newPass) => {
          setEmailOrMobile(resetEmail);
          setPassword(newPass);
          setSuccessMsg('Password reset successfully! You can now click Sign In.');
        }}
      />

      {/* Google Sign In Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        selectedRole={selectedRole}
        onLoginSuccess={onLoginSuccess}
      />
    </div>
  );
};
