import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';

export const AuthModal = ({ isOpen, onClose, initialTab = 'admin', initialPlan = 'Gold Pro Athlete' }) => {
  const { login, registerTrainee, plans } = useGym();
  const [activeTab, setActiveTab] = useState(initialTab); // 'admin' | 'trainer' | 'member' | 'register'

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [emergencyContact, setEmergencyContact] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Quick Demo credentials
  const fillDemo = (role) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (role === 'admin') {
      setActiveTab('admin');
      setEmail('admin@gym.com');
      setPassword('admin123');
    } else if (role === 'trainer') {
      setActiveTab('trainer');
      setEmail('trainer@gym.com');
      setPassword('trainer123');
    } else if (role === 'member') {
      setActiveTab('member');
      setEmail('member@gym.com');
      setPassword('member123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const roleName = activeTab === 'admin' ? 'Admin' : activeTab === 'trainer' ? 'Trainer' : 'Member';
    const res = await login(email, password, roleName);

    setIsLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await registerTrainee({
      name,
      email,
      password,
      phone,
      gender,
      plan: selectedPlan,
      emergencyContact
    });

    setIsLoading(false);
    if (res.success) {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        onClose();
      }, 800);
    } else {
      setErrorMsg(res.message || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-black text-white text-lg">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Gym Portal Access</h2>
              <p className="text-xs text-slate-400">Select your account role to sign in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Quick Demo Selector */}
        <div className="px-6 pt-4 pb-2 bg-slate-950/50 border-b border-slate-800/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">⚡ 1-Click Quick Demo:</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition-all"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('trainer')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-all"
            >
              Trainer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('member')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
            >
              Trainee
            </button>
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-4 p-1.5 mx-6 mt-4 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('trainer'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'trainer'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏋️ Trainer
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('member'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'member'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            👤 Trainee
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📝 Register
          </button>
        </div>

        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        {activeTab !== 'register' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {activeTab === 'admin' ? 'Admin Email' : activeTab === 'trainer' ? 'Coach / Trainer Email' : 'Member Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  activeTab === 'admin' ? 'admin@gym.com' : activeTab === 'trainer' ? 'trainer@gym.com' : 'member@gym.com'
                }
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-lg ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                  : activeTab === 'trainer'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              } flex items-center justify-center space-x-2 disabled:opacity-60`}
            >
              {isLoading ? (
                <span>Authenticating with MongoDB...</span>
              ) : (
                <span>
                  Login to {activeTab === 'admin' ? 'Admin ERP' : activeTab === 'trainer' ? 'Coach Portal' : 'Trainee Hub'} →
                </span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Choose Membership Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500 text-sm"
              >
                {plans.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} — ${p.price}/{p.billingPeriod || 'mo'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name & Contact (e.g. Father/Partner)"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Registering Member in Database...</span>
              ) : (
                <span>Complete Registration & Open Dashboard →</span>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-semibold text-slate-200">MongoDB Database & Express API</span>
          </p>
        </div>
      </div>
    </div>
  );
};
