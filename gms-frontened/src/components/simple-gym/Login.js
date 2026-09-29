import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { GoogleSignInModal } from './GoogleSignInModal';

export const Login = ({ onLoginSuccess, onBackToHome }) => {
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'Trainer' | 'Member'
  const [isRegister, setIsRegister] = useState(false);

  // Form states (Completely empty - NO demo credentials)
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration specific states
  const [userName, setUserName] = useState('');
  const [gymName, setGymName] = useState('');
  const [phone, setPhone] = useState('');

  // Modals state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Validation helpers for registration
  const cleanedPhone = phone.replace(/\D/g, '');
  const isPhoneValid = cleanedPhone.length === 10;
  const isPassLengthValid = password.length >= 6;
  const hasPassLetter = /[A-Za-z]/.test(password);
  const hasPassNumber = /\d/.test(password);
  const isPassValid = isPassLengthValid && hasPassLetter && hasPassNumber;
  const isConfirmPassMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setIsRegister(false);
    setErrorMsg('');
    setSuccessMsg('');
    setEmailOrMobile('');
    setPassword('');
    setConfirmPassword('');
  };

  const handlePhoneChange = (e) => {
    // Only accept numeric digits, up to 10 digits
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isRegister) {
      // 1. Validate Gym Name & Owner Name
      if (!gymName.trim() || gymName.trim().length < 2) {
        setErrorMsg('Please enter a valid Gym Business Name (at least 2 characters).');
        return;
      }
      if (!userName.trim() || userName.trim().length < 2) {
        setErrorMsg('Please enter the Owner/Manager Full Name (at least 2 characters).');
        return;
      }

      // 2. Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailOrMobile.trim() || !emailRegex.test(emailOrMobile.trim())) {
        setErrorMsg('Please enter a valid email address (e.g. owner@gym.com).');
        return;
      }

      // 3. Strict Phone validation: Exactly 10 digits
      if (!isPhoneValid) {
        setErrorMsg('Phone number must be exactly 10 digits (numbers only, no spaces or special characters).');
        return;
      }

      // 4. Strict Password validation
      if (!isPassLengthValid) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (!hasPassLetter || !hasPassNumber) {
        setErrorMsg('Password must contain at least one letter (A-Z or a-z) and at least one number (0-9).');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      setLoading(true);
      const res = await authAPI.register({
        userName: userName.trim(),
        gymName: gymName.trim(),
        email: emailOrMobile.trim(),
        password,
        phone: cleanedPhone
      });
      setLoading(false);

      if (res.success && res.user) {
        setSuccessMsg('Account registered successfully! Logging you into your new Gym...');
        localStorage.setItem('gym_app_user', JSON.stringify({ ...res.user, role: 'Admin' }));
        setTimeout(() => {
          onLoginSuccess(res.user, 'Admin');
        }, 800);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please check inputs.');
      }
    } else {
      // Login flow
      if (!emailOrMobile.trim()) {
        setErrorMsg(
          selectedRole === 'Member'
            ? 'Please enter your registered 10-digit mobile number or email.'
            : 'Please enter your registered email address or mobile number.'
        );
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your account password.');
        return;
      }

      setLoading(true);
      const res = await authAPI.login(emailOrMobile.trim(), password, selectedRole);
      setLoading(false);

      if (res.success) {
        const payload = selectedRole === 'Member' ? res.member : res.user;
        localStorage.setItem('gym_app_user', JSON.stringify({ ...payload, role: res.role }));
        onLoginSuccess(payload, res.role);
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please verify your details and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B1528] to-slate-950 flex items-center justify-center p-3 sm:p-6 font-sans text-slate-100">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 relative z-10">
        {/* Brand / Navigation Header */}
        <div className="text-center mb-6">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-900 mb-3 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 hover:bg-cyan-100 transition-all cursor-pointer"
            >
              <span>← Back to Website Home</span>
            </button>
          )}

          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-cyan-600/25 mb-3">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isRegister ? 'Register Gym Account' : 'Sign In to IronPulse'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isRegister
              ? 'Create a fresh, dedicated workspace for your gym'
              : 'Secure access for Gym Owners, Coaches & Members'}
          </p>
        </div>

        {/* Role Selector Tabs (Only when not in register mode) */}
        {!isRegister ? (
          <div className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => handleRoleChange('Admin')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 ${
                selectedRole === 'Admin'
                  ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>🛡️ Admin</span>
              <span className="text-[9px] font-medium opacity-70">Gym Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('Trainer')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 ${
                selectedRole === 'Trainer'
                  ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>🏋️ Trainer</span>
              <span className="text-[9px] font-medium opacity-70">Coach</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('Member')}
              className={`py-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 ${
                selectedRole === 'Member'
                  ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>👤 Member</span>
              <span className="text-[9px] font-medium opacity-70">Athlete</span>
            </button>
          </div>
        ) : (
          <div className="mb-5 p-3 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-cyan-900 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base">🛡️</span>
              <span className="font-bold">Registering as Gym Administrator</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-cyan-700 font-bold hover:underline"
            >
              ← Sign In
            </button>
          </div>
        )}

        {/* Admin Register / Sign-in Toggle Link */}
        {selectedRole === 'Admin' && !isRegister && (
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">New gym owner?</span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-bold text-cyan-700 hover:text-cyan-900 hover:underline flex items-center space-x-1"
            >
              <span>+ Create New Gym Account</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2.5 animate-fadeIn">
            <span className="text-base leading-none">⚠️</span>
            <div className="font-semibold leading-relaxed flex-1">{errorMsg}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2.5 animate-fadeIn">
            <span className="text-base leading-none">✓</span>
            <div className="font-semibold leading-relaxed flex-1">{successMsg}</div>
          </div>
        )}

        {/* Google Authentication Option */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-cyan-500 hover:bg-slate-50/80 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-center space-x-2.5 shadow-xs group cursor-pointer"
          >
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
            <span className="group-hover:text-slate-900">
              {isRegister ? 'Register with Google' : `Sign in with Google (${selectedRole})`}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full border-t border-slate-200"></div>
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
            or with account credentials
          </span>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* REGISTRATION FIELDS */}
          {isRegister && (
            <>
              {/* Gym Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gym Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="e.g. IronPulse Fitness Club"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Owner / Administrator Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* Contact Phone (10 digits strictly enforced) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Phone Number (10 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPhoneValid
                        ? 'bg-emerald-100 text-emerald-800'
                        : phone.length > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {phone.length}/10 {isPhoneValid && '✓ Valid'}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 font-bold text-xs select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold tracking-wider placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Only numeric digits allowed. Must be exactly 10 digits.
                </p>
              </div>
            </>
          )}

          {/* Email / Mobile Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isRegister
                ? 'Official Email Address *'
                : selectedRole === 'Member'
                ? '10-Digit Mobile Number or Email *'
                : 'Email Address or Mobile *'}
            </label>
            <input
              type={isRegister ? 'email' : 'text'}
              required
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              placeholder={
                isRegister
                  ? 'owner@yourgym.com'
                  : selectedRole === 'Member'
                  ? '9876543210 or member@gmail.com'
                  : selectedRole === 'Trainer'
                  ? 'trainer@gym.com or 9876543210'
                  : 'admin@yourgym.com or 9876543210'
              }
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>

              {!isRegister && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  (selectedRole === 'Member' || selectedRole === 'Trainer') && !isRegister
                    ? 'Enter password (first time: your name)'
                    : '••••••••'
                }
                className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm p-1 focus:outline-none"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Registration Password Rules Checklist */}
            {isRegister && (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
                <div className="font-bold text-slate-700 mb-1 text-[10px] uppercase tracking-wider">
                  Password Requirements:
                </div>
                <div className={`flex items-center space-x-1.5 ${isPassLengthValid ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <span>{isPassLengthValid ? '✓' : '○'}</span>
                  <span>Minimum 6 characters</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasPassLetter ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <span>{hasPassLetter ? '✓' : '○'}</span>
                  <span>Contains at least one letter (a-z, A-Z)</span>
                </div>
                <div className={`flex items-center space-x-1.5 ${hasPassNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                  <span>{hasPassNumber ? '✓' : '○'}</span>
                  <span>Contains at least one number (0-9)</span>
                </div>
              </div>
            )}

            {(selectedRole === 'Member' || selectedRole === 'Trainer') && !isRegister && (
              <p className="text-[10px] text-cyan-800 font-semibold mt-1.5">
                💡 Tip: If you were enrolled by your Gym Admin, your initial login password is your registered Name.
              </p>
            )}
          </div>

          {/* Confirm Password Field (Registration Mode) */}
          {isRegister && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold ${isConfirmPassMatch ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {isConfirmPassMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-2.5 pr-10 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition-all ${
                    confirmPassword
                      ? isConfirmPassMatch
                        ? 'border-emerald-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20'
                        : 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm p-1 focus:outline-none"
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-60 mt-3 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Processing...</span>
              </span>
            ) : isRegister ? (
              'Create Gym Account & Launch Workspace →'
            ) : (
              `Sign In as ${selectedRole} →`
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-400 mt-6 pt-4 border-t border-slate-100">
          IronPulse Gym Management ERP • Secure Cloud Database
        </div>
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
