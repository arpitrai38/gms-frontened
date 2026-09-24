import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

export const ForgotPasswordModal = ({ isOpen, onClose, initialEmail = '', initialRole = 'Admin', onPasswordResetSuccess }) => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & New Password, 3: Success
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devOtpHint, setDevOtpHint] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRole(initialRole || 'Admin');
      setEmail(initialEmail || '');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setSuccessMsg('');
      setDevOtpHint('');
      setCountdown(60);
    }
  }, [isOpen, initialEmail, initialRole]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email || !email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const res = await authAPI.forgotPassword(email.trim(), role);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || 'OTP code sent successfully!');
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setStep(2);
      setCountdown(60);
    } else {
      setErrorMsg(res.message || 'Failed to send OTP code. Please check your email.');
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the full 6-digit OTP code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 3) {
      setErrorMsg('New password must be at least 3 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    const res = await authAPI.resetPassword({
      email: email.trim(),
      otp: otp.trim(),
      newPassword: newPassword.trim()
    });
    setLoading(false);

    if (res.success) {
      setStep(3);
      if (onPasswordResetSuccess) {
        onPasswordResetSuccess(email.trim(), newPassword.trim());
      }
      setTimeout(() => {
        onClose();
      }, 1800);
    } else {
      setErrorMsg(res.message || 'Failed to reset password. Please check your OTP.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl shadow-xs">
              🔑
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Forgot Password</h3>
              <p className="text-xs text-slate-500">Reset your password via 6-digit email OTP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Pill */}
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              1
            </span>
            <span className="text-xs font-semibold text-slate-600">Send OTP</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200">
            <div className={`h-full bg-cyan-500 transition-all duration-300 ${
              step >= 2 ? 'w-full' : 'w-0'
            }`} />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </span>
            <span className="text-xs font-semibold text-slate-600">Verify & Reset</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && step !== 3 && (
          <div className="mt-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-xs">
            ✓ {successMsg}
          </div>
        )}

        {/* Instant OTP Preview for Dev / Testing */}
        {devOtpHint && step === 2 && (
          <div className="mt-3 p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-cyan-950">⚡ Verification OTP Code: </span>
                <span className="font-mono font-black text-sm tracking-widest text-cyan-900 bg-white px-2.5 py-1 rounded-lg border border-cyan-300 shadow-xs ml-1">
                  {devOtpHint}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(devOtpHint)}
                className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[10px] rounded-lg shadow-xs transition-all"
              >
                1-Click Auto-Fill
              </button>
            </div>
            <p className="text-[10px] text-cyan-700">
              💡 <em>To deliver live emails straight to your Gmail/Google app inbox, add your Gmail App Password to <code className="bg-white/70 px-1 py-0.5 rounded text-cyan-900">backend/.env</code>. In local testing, your OTP is displayed right here!</em>
            </p>
          </div>
        )}

        {/* STEP 1: REQUEST OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="mt-5 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Select Account Role</label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    role === 'Admin'
                      ? 'bg-white text-cyan-800 shadow-xs border border-cyan-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🛡️ Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Trainer')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    role === 'Trainer'
                      ? 'bg-white text-cyan-800 shadow-xs border border-cyan-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🏋️ Trainer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Member')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    role === 'Member'
                      ? 'bg-white text-cyan-800 shadow-xs border border-cyan-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  👤 Member
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Your Registered Email / Google Account *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@gmail.com or admin@gym.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                A 6-digit secure verification code will be sent to this email address.
              </p>
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
                {loading ? 'Sending OTP...' : 'Send OTP Code →'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ENTER OTP & NEW PASSWORD */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="mt-5 space-y-3.5 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Enter 6-Digit OTP *</label>
                <span className="text-[10px] text-slate-400">Sent to {email}</span>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono tracking-widest text-center text-base font-bold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

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

            {/* Resend OTP */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline"
              >
                Change Email
              </button>

              {countdown > 0 ? (
                <span className="text-[11px] text-slate-400">
                  Resend OTP in <strong className="text-slate-600">{countdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="text-[11px] font-bold text-cyan-600 hover:text-cyan-800 underline"
                >
                  Resend OTP Now
                </button>
              )}
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
                {loading ? 'Verifying...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center text-3xl font-black animate-bounce">
              ✓
            </div>
            <h4 className="text-base font-black text-slate-900">Password Reset Successful!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your password has been securely updated. You can now log in using your new credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
