import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { ForgotPasswordModal } from '../simple-gym/ForgotPasswordModal';
import { GoogleSignInModal } from '../simple-gym/GoogleSignInModal';

export const HomePage = ({ onLaunchGymApp, gymUser, onLogout }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState('Admin'); // 'Admin' | 'Trainer' | 'Member'
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form states (Empty by default - ZERO demo data)
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration specific states
  const [registerGymName, setRegisterGymName] = useState('');
  const [registerOwnerName, setRegisterOwnerName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');

  // UI state
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  // Validation rules for registration
  const cleanedRegPhone = registerPhone.replace(/\D/g, '');
  const isPhoneValid = cleanedRegPhone.length === 10;
  const isPassLengthValid = password.length >= 6;
  const hasPassLetter = /[A-Za-z]/.test(password);
  const hasPassNumber = /\d/.test(password);
  const isPassValid = isPassLengthValid && hasPassLetter && hasPassNumber;
  const isConfirmPassMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Open modal with specific role and mode
  const handleOpenAuthModal = (role = 'Admin', register = false) => {
    setModalRole(role);
    setIsRegisterMode(register);
    setAuthError('');
    setAuthSuccess('');
    setEmailOrPhone('');
    setPassword('');
    setConfirmPassword('');
    setRegisterGymName('');
    setRegisterOwnerName('');
    setRegisterPhone('');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handlePhoneInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setRegisterPhone(val);
  };

  // Submit Handler for Auth Modal
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (isRegisterMode) {
      if (!registerGymName.trim() || registerGymName.trim().length < 2) {
        setAuthError('Please enter a valid Gym Business Name (at least 2 characters).');
        return;
      }
      if (!registerOwnerName.trim() || registerOwnerName.trim().length < 2) {
        setAuthError('Please enter the Owner/Manager Full Name (at least 2 characters).');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailOrPhone.trim() || !emailRegex.test(emailOrPhone.trim())) {
        setAuthError('Please provide a valid email address (e.g. owner@gym.com).');
        return;
      }

      if (!isPhoneValid) {
        setAuthError('Phone number must be exactly 10 digits (numbers only, no spaces or special characters).');
        return;
      }

      if (!isPassLengthValid) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
      if (!hasPassLetter || !hasPassNumber) {
        setAuthError('Password must contain at least one letter and at least one number.');
        return;
      }
      if (password !== confirmPassword) {
        setAuthError('Passwords do not match. Please verify your password confirmation.');
        return;
      }

      setAuthLoading(true);
      const res = await authAPI.register({
        gymName: registerGymName.trim(),
        userName: registerOwnerName.trim(),
        email: emailOrPhone.trim(),
        password,
        phone: cleanedRegPhone
      });
      setAuthLoading(false);

      if (res.success && res.user) {
        setAuthSuccess('Gym account registered successfully! Entering your workspace...');
        localStorage.setItem('gym_app_user', JSON.stringify({ ...res.user, role: 'Admin' }));
        setTimeout(() => {
          onLaunchGymApp(res.user, 'Admin');
          setIsAuthModalOpen(false);
        }, 700);
      } else {
        setAuthError(res.message || 'Registration failed. Please check your information.');
      }
    } else {
      if (!emailOrPhone.trim()) {
        setAuthError(
          modalRole === 'Member'
            ? 'Please enter your registered 10-digit mobile number or email.'
            : 'Please enter your registered email address or mobile number.'
        );
        return;
      }
      if (!password) {
        setAuthError('Please enter your account password.');
        return;
      }

      setAuthLoading(true);
      const res = await authAPI.login(emailOrPhone.trim(), password, modalRole);
      setAuthLoading(false);

      if (res.success) {
        const payload = modalRole === 'Member' ? res.member : res.user;
        localStorage.setItem('gym_app_user', JSON.stringify({ ...payload, role: res.role || modalRole }));
        onLaunchGymApp(payload, res.role || modalRole);
        setIsAuthModalOpen(false);
      } else {
        setAuthError(res.message || 'Invalid credentials. Please verify your details.');
      }
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FCFD] text-slate-900 font-sans selection:bg-cyan-500 selection:text-white relative">
      {/* Background ambient gradient glow in soft White & Aqua */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-cyan-200/35 rounded-full blur-[160px]"></div>
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-[160px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] bg-cyan-100/40 rounded-full blur-[160px]"></div>
      </div>

      {/* ============================================================ */}
      {/* 1. TOP NAVIGATION BAR */}
      {/* ============================================================ */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-cyan-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-cyan-600/25 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-cyan-900 to-teal-800 bg-clip-text text-transparent">
                  IRONPULSE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
                  GMS
                </span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">
                Facility & Member Cloud ERP
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
            <a href="#portals" className="hover:text-cyan-600 transition-colors">Workspaces</a>
            <a href="#workflow" className="hover:text-cyan-600 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-cyan-600 transition-colors">Plans</a>
            <a href="#developer" className="hover:text-cyan-600 transition-colors text-cyan-700 font-bold">About Developer</a>
            <a href="#faq" className="hover:text-cyan-600 transition-colors">FAQ</a>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center space-x-3">
            {gymUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-cyan-100">
                  <span className="text-sm">👤</span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                    {gymUser.userName || gymUser.name || 'Admin'}
                  </span>
                </div>
                <button
                  onClick={() => onLaunchGymApp(gymUser, gymUser.role || 'Admin')}
                  className="py-2 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-md shadow-cyan-600/20 transition-all cursor-pointer active:scale-95"
                >
                  Go to Dashboard →
                </button>
                <button
                  onClick={onLogout}
                  className="py-2 px-3 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                  title="Sign out of your session"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => handleOpenAuthModal('Admin', false)}
                  className="py-2 px-3.5 sm:px-4 rounded-xl border border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-cyan-700 bg-white hover:bg-cyan-50/50 text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleOpenAuthModal('Admin', true)}
                  className="py-2 px-3.5 sm:px-5 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Register Gym
                </button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-700 hover:text-cyan-600 border border-slate-200"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-cyan-100 px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600"
            >
              Features
            </a>
            <a
              href="#portals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600"
            >
              Workspaces & Portals
            </a>
            <a
              href="#workflow"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600"
            >
              Membership Packages
            </a>
            <a
              href="#developer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-cyan-700 hover:text-cyan-800"
            >
              About Developer
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-700 hover:text-cyan-600"
            >
              FAQ
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <button
                onClick={() => handleOpenAuthModal('Admin', false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-700 bg-white"
              >
                Sign In to Account
              </button>
              <button
                onClick={() => handleOpenAuthModal('Admin', true)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-center font-bold text-xs text-white shadow-md shadow-cyan-600/20"
              >
                Register New Gym
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================ */}
      {/* 2. HERO SECTION (WHITE & AQUA THEME) */}
      {/* ============================================================ */}
      <section className="relative z-10 pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span>ENTERPRISE-GRADE GYM MANAGEMENT INFRASTRUCTURE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Run Your Entire Gym <br />
                <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 bg-clip-text text-transparent">
                  With Absolute Precision.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                The modern, all-in-one operations platform for gym owners, fitness trainers, and members. Contactless QR turnstile check-ins, automated subscription renewals with collection guard, trainer workout builders, and real-time financial telemetry.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => handleOpenAuthModal('Admin', true)}
                  className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>⚡ Register Your Gym</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => handleOpenAuthModal('Admin', false)}
                  className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-cyan-50/50 border border-cyan-200 text-slate-800 hover:text-cyan-800 font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>🔑 Sign In to Workspace</span>
                </button>

                <a
                  href="#features"
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-200 hover:border-cyan-300 text-slate-600 hover:text-cyan-700 font-semibold text-sm transition-all flex items-center justify-center bg-white"
                >
                  Explore Features ↓
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-cyan-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 font-semibold">
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-600 text-base">✓</span>
                  <span>10-Digit Mobile Auth</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-600 text-base">✓</span>
                  <span>Contactless Turnstile QR</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-600 text-base">✓</span>
                  <span>Collection Inflation Guard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-cyan-600 text-base">✓</span>
                  <span>Secure Cloud MongoDB</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Command Center Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-400 to-teal-400 opacity-20 blur-xl"></div>

                {/* Main Card in White & Aqua */}
                <div className="relative bg-white border border-cyan-100 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-cyan-950/5 backdrop-blur-xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Live Floor Telemetry
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                      ⚡ Turnstile Engine
                    </span>
                  </div>

                  {/* Floor Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3 my-5">
                    <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-center">
                      <span className="text-[10px] font-bold text-cyan-800 block uppercase">Floor Count</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">18</span>
                      <span className="text-[9px] text-emerald-700 block font-semibold">Active now</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
                      <span className="text-[10px] font-bold text-teal-800 block uppercase">Today's Visits</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">42</span>
                      <span className="text-[9px] text-cyan-700 block font-semibold">+14% vs avg</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-center">
                      <span className="text-[10px] font-bold text-sky-800 block uppercase">Collection</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">100%</span>
                      <span className="text-[9px] text-emerald-700 block font-semibold">Protected</span>
                    </div>
                  </div>

                  {/* Dynamic Turnstile Pass Simulation */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-cyan-100/60 mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white text-xs font-black">
                          QR
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Contactless QR Turnstile</p>
                          <p className="text-[10px] text-cyan-700">Dynamic Scan Engine</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        ● Live Sync
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-600">
                      <span>Verification Speed:</span>
                      <span className="font-mono font-bold text-cyan-800">&lt; 0.8s Scan</span>
                    </div>
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => handleOpenAuthModal('Admin', false)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 text-center cursor-pointer"
                    >
                      Admin Sign In →
                    </button>
                    <button
                      onClick={() => handleOpenAuthModal('Member', false)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold text-xs text-center cursor-pointer shadow-2xs"
                    >
                      Member Pass →
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. LIVE STATS / METRICS BANNER */}
      {/* ============================================================ */}
      <section className="relative z-10 py-10 bg-white border-y border-cyan-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-cyan-50/40 border border-cyan-100/60">
              <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-mono">
                99.9%
              </span>
              <p className="text-xs text-slate-600 font-semibold mt-1">Platform Uptime & Cloud SLA</p>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100/60">
              <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-mono">
                &lt; 1.2s
              </span>
              <p className="text-xs text-slate-600 font-semibold mt-1">QR Pass Turnstile Scan Speed</p>
            </div>
            <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100/60">
              <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent font-mono">
                100%
              </span>
              <p className="text-xs text-slate-600 font-semibold mt-1">Collection Integrity Protected</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100/60">
              <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-mono">
                10-Digit
              </span>
              <p className="text-xs text-slate-600 font-semibold mt-1">Strict Mobile Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CORE FEATURES SECTION (WHITE & AQUA) */}
      {/* ============================================================ */}
      <section id="features" className="relative z-10 py-20 bg-[#F8FCFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
              Platform Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Built For Complete Gym Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              Every feature engineered for high reliability, clean data integrity, and effortless daily floor management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                📱
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">10-Digit Mobile Auth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clean phone validation rules prevent typos and fake accounts. Fast OTP password reset delivered directly to user email.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Collection Guard & Renewals</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart renewal engine prevents renewing active memberships, eliminating premature collection inflation and ensuring accurate monthly revenue books.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Contactless QR Turnstile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dynamic QR pass generation for smartphone screens with camera scanner for front-desk turnstiles and sub-second attendance logs.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                🏋️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Trainer Workout Hub</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated coach workspace to design Push-Pull-Legs workout splits, prescribe sets/reps, and monitor assigned trainee performance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                🧾
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1-Click PDF Tax Invoicing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate professional, tax-compliant GST receipts with your gym branding, printable and downloadable instantly for members.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-xl hover:-translate-y-1 transition-all group shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Real-Time Revenue Telemetry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-level operational overview: collection curves, active vs expired member ratios, floor turnover, and growth charts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ROLE-BASED WORKSPACES SHOWCASE (WHITE & AQUA) */}
      {/* ============================================================ */}
      <section id="portals" className="relative z-10 py-20 bg-white border-y border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
              Role-Based Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Dedicated Workspaces For Every Stakeholder
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              Granular role isolation ensures gym administrators, personal coaches, and members each have their tailored interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Workspace 1: Admin */}
            <div className="p-7 rounded-3xl bg-cyan-50/40 border border-cyan-200 flex flex-col justify-between hover:border-cyan-400 hover:shadow-xl transition-all shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-100 text-cyan-800 border border-cyan-200">
                  Facility Leadership
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-3 mb-2">Gym Owner & Admin Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Complete operations oversight. Register members, dispatch coaches, monitor daily floor attendance, generate invoices, and analyze revenue trends.
                </p>
                <div className="space-y-2 mb-8 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>Executive Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>Staff & Coach Onboarding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>Membership Tier & Fee Management</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenAuthModal('Admin', false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
              >
                Sign In as Admin →
              </button>
            </div>

            {/* Workspace 2: Trainer */}
            <div className="p-7 rounded-3xl bg-teal-50/40 border border-teal-200 flex flex-col justify-between hover:border-teal-400 hover:shadow-xl transition-all shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                  Coaching Staff
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-3 mb-2">Trainer & Coach Hub</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Empower coaches to construct personalized workout splits, track client PRs, calibrate macros, and monitor their assigned client rosters.
                </p>
                <div className="space-y-2 mb-8 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Client Roster Management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>PPL Workout Routine Builder</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-teal-600 font-bold">✓</span>
                    <span>Coach Profile & Specialty Credentials</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenAuthModal('Trainer', false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
              >
                Sign In as Trainer →
              </button>
            </div>

            {/* Workspace 3: Member */}
            <div className="p-7 rounded-3xl bg-sky-50/40 border border-sky-200 flex flex-col justify-between hover:border-sky-400 hover:shadow-xl transition-all shadow-sm">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                  Self-Service Pass
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-3 mb-2">Member Digital Pass</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Members access their dynamic turnstile QR pass, check active membership validity, view assigned workout plans, and download billing invoices.
                </p>
                <div className="space-y-2 mb-8 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>Instant Dynamic QR Turnstile Entry</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>Days Remaining & Expiry Tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-600 font-bold">✓</span>
                    <span>Tax Receipts & Payment History</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleOpenAuthModal('Member', false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
              >
                Sign In as Member →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. HOW THE SYSTEM WORKS (WHITE & AQUA) */}
      {/* ============================================================ */}
      <section id="workflow" className="relative z-10 py-20 bg-[#F8FCFD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
              Operational Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              How IronPulse Works In 4 Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              From gym setup to contactless floor entry and automated accounting in four frictionless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Register Gym & Tiers',
                desc: 'Create your owner account with 10-digit phone verification and configure membership billing tiers.'
              },
              {
                step: '02',
                title: 'Onboard Members & Coaches',
                desc: 'Add members with emergency contacts and photo avatars. Assign fitness coaches to clients.'
              },
              {
                step: '03',
                title: 'Contactless Turnstile Scan',
                desc: 'Members flash dynamic smartphone passes for contactless entry while coaches track workout splits.'
              },
              {
                step: '04',
                title: 'Automated Dues & Invoicing',
                desc: 'System automatically flags expiring passes, generates tax invoices, and protects against collection inflation.'
              }
            ].map((s) => (
              <div
                key={s.step}
                className="p-6 rounded-3xl bg-white border border-cyan-100 hover:border-cyan-300 hover:shadow-lg transition-all shadow-xs relative"
              >
                <div className="text-3xl font-black text-cyan-600 font-mono mb-3">{s.step}</div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. MEMBERSHIP TIERS / PRICING (WHITE & AQUA) */}
      {/* ============================================================ */}
      <section id="pricing" className="relative z-10 py-20 bg-white border-y border-cyan-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200">
              Configurable Membership Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Standard Membership Packages
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              Fully customizable packages out-of-the-box for your gym members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '1 Month Plan', months: '1 Month', price: '₹1,000', badge: 'Standard', desc: 'Full gym floor access & cardio' },
              { title: '3 Months Plan', months: '3 Months', price: '₹2,500', badge: 'Popular', desc: 'Quarterly training with locker facility' },
              { title: '6 Months Plan', months: '6 Months', price: '₹4,500', badge: 'Best Value', desc: 'Half-yearly package with trainer check-ins' },
              { title: '1 Year Plan', months: '12 Months', price: '₹8,000', badge: 'VIP Annual', desc: 'Annual pass with complimentary protein shakes' }
            ].map((plan, idx) => (
              <div
                key={plan.title}
                className={`p-6 rounded-3xl bg-white border flex flex-col justify-between transition-all ${
                  idx === 1
                    ? 'border-cyan-500 shadow-xl shadow-cyan-600/10 relative scale-[1.02]'
                    : 'border-cyan-100 hover:border-cyan-300 shadow-sm'
                }`}
              >
                {idx === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
                    Most Popular
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider bg-cyan-50 px-2 py-0.5 rounded">
                    {plan.badge}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2">{plan.title}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-xs text-slate-500 ml-1">/ {plan.months}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-6">{plan.desc}</p>
                  <div className="space-y-2 text-xs text-slate-600 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-600 font-bold">✓</span>
                      <span>Digital Smartphone QR Pass</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-600 font-bold">✓</span>
                      <span>Automated Invoicing & GST Receipt</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-600 font-bold">✓</span>
                      <span>Locker & Shower Access</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAuthModal('Admin', true)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    idx === 1
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-md shadow-cyan-600/25'
                      : 'bg-slate-100 hover:bg-cyan-50 text-slate-800 hover:text-cyan-800 border border-slate-200'
                  }`}
                >
                  Configure in My Gym →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. ABOUT DEVELOPER SECTION (FEATURED PROFILE FOR ARPIT RAI) */}
      {/* ============================================================ */}
      <section id="developer" className="relative z-10 py-20 bg-gradient-to-b from-[#F0FDFA] via-[#F8FCFD] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-3.5 py-1 rounded-full border border-cyan-200">
              Architect & Full-Stack Engineer
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Crafted With Engineering Excellence
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-normal">
              Meet the lead architect and engineer behind the IronPulse Gym Management System.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-white border border-cyan-200 rounded-3xl p-6 sm:p-10 shadow-xl shadow-cyan-950/5 relative overflow-hidden">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Avatar, Identity & Status */}
              <div className="lg:col-span-4 text-center flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-cyan-500 p-1 shadow-xl shadow-cyan-600/25">
                    <img
                      src="/arpit-rai.png"
                      alt="Arpit Rai - Lead Full-Stack Architect"
                      className="w-full h-full rounded-[22px] object-cover bg-slate-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
                      }}
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="Active & Available"></span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Arpit Rai</h3>
                <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider mt-0.5">
                  Lead Full-Stack Architect
                </p>

                <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Available for Engineering Roles</span>
                </div>

                {/* Direct Action Links */}
                <div className="mt-6 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full">
                  <a
                    href="https://github.com/arpitrai38"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>View GitHub Profile</span>
                  </a>

                  <a
                    href="mailto:sadhanamarendra12@gmail.com"
                    className="py-2.5 px-4 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>✉️</span>
                    <span>Contact via Email</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Technical Bio, System Highlights & Tech Stack */}
              <div className="lg:col-span-8 space-y-5 lg:pl-6 lg:border-l lg:border-cyan-100">
                <div>
                  <h4 className="text-lg font-black text-slate-900">Engineering Profile & Philosophy</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 font-normal">
                    Passionate software engineer specializing in scalable MERN stack architectures, high-performance web applications, cloud database systems, and secure authentication infrastructure. Designed and engineered the end-to-end IronPulse platform with multi-tenant gym isolation, automated membership life-cycle engines, and mobile-first responsive dashboards.
                  </p>
                </div>

                {/* Key System Highlights */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                    Architectural Milestones Implemented in this Project:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                    <div className="p-2.5 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-start space-x-2">
                      <span className="text-cyan-600 font-bold">✓</span>
                      <span><strong>Multi-Role RBAC:</strong> Granular isolation for Gym Admins, Coaches, and Members.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-teal-50/50 border border-teal-100 flex items-start space-x-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span><strong>Collection Guard:</strong> Enforces renewals solely on expired passes to protect revenue telemetry.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 flex items-start space-x-2">
                      <span className="text-sky-600 font-bold">✓</span>
                      <span><strong>Contactless QR:</strong> Sub-second dynamic QR code scanner for front-desk turnstiles.</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Clean Tenancy:</strong> Strict 10-digit phone verification with automated OTP password recovery.</span>
                    </div>
                  </div>
                </div>

                {/* Core Tech Stack Badges */}
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                    Core Technical Stack:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'React.js',
                      'Node.js',
                      'Express.js',
                      'MongoDB Atlas',
                      'Tailwind CSS',
                      'RESTful APIs',
                      'System Design',
                      'JWT & Auth',
                      'Git & GitHub'
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ============================================================ */}
      <section id="faq" className="relative z-10 py-20 bg-white border-t border-cyan-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-800 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-200">
              Clear Answers
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How does the 10-digit phone verification work?',
                a: 'All account registrations and member enrollments require an exact 10-digit phone number. This prevents faulty records and enables seamless SMS/email receipt and OTP delivery.'
              },
              {
                q: 'Why are active members blocked from premature renewal?',
                a: 'To guarantee strict financial integrity, renewals can only be processed when a subscription has expired. This prevents false collection inflation and ensures your monthly revenue reporting accurately reflects current dues.'
              },
              {
                q: 'How do members use the contactless QR pass?',
                a: 'Members log in on any smartphone using their 10-digit mobile number or email. Their dynamic QR pass is always available on their home screen for rapid scanning at turnstiles or front desks.'
              },
              {
                q: 'What password rules are enforced upon registration?',
                a: 'To guarantee facility data protection, all new account passwords must be at least 6 characters long and contain at least one letter and at least one number.'
              },
              {
                q: 'Can personal trainers track client workout routines?',
                a: 'Yes! The Trainer Portal allows certified coaches to prescribe workout splits, record client performance, and monitor assigned trainees in real time.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-sm text-slate-800 hover:text-cyan-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono ml-4 text-cyan-600">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. FOOTER (WHITE & AQUA THEME) */}
      {/* ============================================================ */}
      <footer className="relative z-10 bg-white border-t border-cyan-100 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center font-black text-white text-lg shadow-sm">
                ⚡
              </div>
              <div>
                <span className="font-black text-slate-900 text-base tracking-tight">IRONPULSE GMS</span>
                <p className="text-[10px] text-slate-500">Enterprise Fitness Management Infrastructure</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
              <a href="#features" className="hover:text-cyan-600 transition-colors">Features</a>
              <a href="#portals" className="hover:text-cyan-600 transition-colors">Portals</a>
              <a href="#workflow" className="hover:text-cyan-600 transition-colors">Workflow</a>
              <a href="#pricing" className="hover:text-cyan-600 transition-colors">Pricing</a>
              <a href="#developer" className="hover:text-cyan-600 transition-colors text-cyan-700 font-bold">Developer</a>
              <button
                onClick={() => handleOpenAuthModal('Admin', false)}
                className="text-cyan-700 hover:underline font-bold cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleOpenAuthModal('Admin', true)}
                className="text-cyan-700 hover:underline font-bold cursor-pointer"
              >
                Register Gym
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} IronPulse GMS. Designed & Architected by <strong>Arpit Rai</strong>. Powered by MongoDB.
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 font-medium">All Cloud Services Operational</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* 11. AUTH MODAL (CLEAN WHITE & AQUA, STRICT VALIDATION, NO GOOGLE) */}
      {/* ============================================================ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border border-cyan-100 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 max-h-[95vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-cyan-600/25 mb-3">
                ⚡
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isRegisterMode ? 'Register New Gym Account' : 'Sign In to IronPulse'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {isRegisterMode
                  ? 'Set up a clean, dedicated database for your gym'
                  : 'Enter your account credentials to access your portal'}
              </p>
            </div>

            {/* Role Tabs (Sign-In Mode) */}
            {!isRegisterMode ? (
              <div className="grid grid-cols-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setModalRole('Admin');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 ${
                    modalRole === 'Admin'
                      ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>🛡️ Admin</span>
                  <span className="text-[9px] font-medium opacity-70">Gym Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalRole('Trainer');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 ${
                    modalRole === 'Trainer'
                      ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>🏋️ Trainer</span>
                  <span className="text-[9px] font-medium opacity-70">Coach</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalRole('Member');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`py-2 text-xs font-extrabold rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 ${
                    modalRole === 'Member'
                      ? 'bg-white text-cyan-800 shadow-sm border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>👤 Member</span>
                  <span className="text-[9px] font-medium opacity-70">Athlete</span>
                </button>
              </div>
            ) : (
              <div className="mb-5 p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-base">🛡️</span>
                  <span className="font-bold">Registering as Gym Administrator</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-cyan-700 font-bold hover:underline"
                >
                  ← Sign In
                </button>
              </div>
            )}

            {/* Toggle to Registration for Admin */}
            {modalRole === 'Admin' && !isRegisterMode && (
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">New gym owner?</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-900 hover:underline flex items-center space-x-1"
                >
                  <span>+ Register New Gym</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2 animate-fadeIn">
                <span className="text-base leading-none">⚠️</span>
                <div className="font-semibold leading-relaxed flex-1">{authError}</div>
              </div>
            )}

            {/* Success Message */}
            {authSuccess && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2 animate-fadeIn">
                <span className="text-base leading-none">✓</span>
                <div className="font-semibold leading-relaxed flex-1">{authSuccess}</div>
              </div>
            )}

            {/* Google Authentication Option */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:border-cyan-500 hover:bg-slate-50/80 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-center space-x-2.5 shadow-xs group cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                  {isRegisterMode ? 'Register with Google' : `Sign in with Google (${modalRole})`}
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

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegisterMode && (
                <>
                  {/* Gym Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Gym Business Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={registerGymName}
                      onChange={(e) => setRegisterGymName(e.target.value)}
                      placeholder="e.g. IronPulse Fitness"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Owner / Manager Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={registerOwnerName}
                      onChange={(e) => setRegisterOwnerName(e.target.value)}
                      placeholder="e.g. Arpit Rai"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Phone (10 digits strictly enforced) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Phone Number (10 Digits) <span className="text-rose-500">*</span>
                      </label>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPhoneValid
                            ? 'bg-emerald-100 text-emerald-800'
                            : registerPhone.length > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {registerPhone.length}/10 {isPhoneValid && '✓ Valid'}
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
                        value={registerPhone}
                        onChange={handlePhoneInputChange}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold tracking-wider placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email / Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isRegisterMode
                    ? 'Official Email Address *'
                    : modalRole === 'Member'
                    ? '10-Digit Mobile Number or Email *'
                    : 'Email Address or Mobile *'}
                </label>
                <input
                  type={isRegisterMode ? 'email' : 'text'}
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={
                    isRegisterMode
                      ? 'owner@yourgym.com'
                      : modalRole === 'Member'
                      ? '9876543210 or member@gmail.com'
                      : modalRole === 'Trainer'
                      ? 'trainer@gym.com or 9876543210'
                      : 'admin@yourgym.com or 9876543210'
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>

                  {!isRegisterMode && (
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
                      (modalRole === 'Member' || modalRole === 'Trainer') && !isRegisterMode
                        ? 'Enter password (first time: your name)'
                        : '••••••••'
                    }
                    className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20"
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

                {/* Password Rule Checklist in Registration Mode */}
                {isRegisterMode && (
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
                      <span>Contains at least one letter</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${hasPassNumber ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                      <span>{hasPassNumber ? '✓' : '○'}</span>
                      <span>Contains at least one number</span>
                    </div>
                  </div>
                )}

                {(modalRole === 'Member' || modalRole === 'Trainer') && !isRegisterMode && (
                  <p className="text-[10px] text-cyan-800 font-semibold mt-1.5">
                    💡 Tip: If you were registered by your Gym Admin, your initial login password is your registered Name.
                  </p>
                )}
              </div>

              {/* Confirm Password (Registration Mode) */}
              {isRegisterMode && (
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
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-2.5 pr-10 bg-slate-50 border rounded-xl text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none ${
                        confirmPassword
                          ? isConfirmPassMatch
                            ? 'border-emerald-400 focus:border-emerald-600'
                            : 'border-rose-300 focus:border-rose-500'
                          : 'border-slate-200 focus:border-cyan-600'
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

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-500 text-white shadow-lg shadow-cyan-600/25 transition-all disabled:opacity-60 mt-3 cursor-pointer"
              >
                {authLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : isRegisterMode ? (
                  'Create Gym Account & Open Dashboard →'
                ) : (
                  `Sign In as ${modalRole} →`
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        initialEmail={emailOrPhone.includes('@') ? emailOrPhone : ''}
        initialRole={modalRole}
        onPasswordResetSuccess={(resetEmail, newPass) => {
          setEmailOrPhone(resetEmail);
          setPassword(newPass);
          setAuthSuccess('Password reset successfully! You can now sign in.');
        }}
      />

      {/* Google Sign In Modal */}
      <GoogleSignInModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        selectedRole={modalRole}
        onLoginSuccess={(user, role) => {
          setIsAuthModalOpen(false);
          onLaunchGymApp(user, role);
        }}
      />
    </div>
  );
};
