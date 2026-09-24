import React, { useState } from 'react';
import { MemberProfileModal } from './MemberProfileModal';

export const MemberView = ({ memberUser, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(memberUser);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Format dates
  const formatDate = (d) => {
    if (!d) return 'N/A';
    try {
      return new Date(d).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return d;
    }
  };

  // Calculate days remaining or overdue
  const calculateDaysRemaining = () => {
    if (!currentUser?.nextBillDate) return null;
    const now = new Date();
    const expiry = new Date(currentUser.nextBillDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();
  const isActive = currentUser?.status === 'Active' && (daysRemaining === null || daysRemaining >= 0);
  const isFirstLogin = currentUser?.isFirstLogin !== false;

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'M';

  const handleMemberUpdated = (updated) => {
    setCurrentUser(updated);
  };

  return (
    <div className="min-h-screen bg-[#F0F7F9] text-slate-800 font-sans">
      {/* Header */}
      <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center space-x-2.5 sm:space-x-3 truncate">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-cyan-500/20 shrink-0">
            🏋️
          </div>
          <div className="truncate">
            <h1 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-center space-x-1.5 sm:space-x-2 truncate">
              <span>MEMBER PORTAL</span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 shrink-0">
                PASS
              </span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 truncate">Welcome, {currentUser?.name || 'Member'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-all flex items-center space-x-1"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Profile & Password</span>
            <span className="sm:hidden">Profile</span>
          </button>

          <button
            onClick={onLogout}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center space-x-1"
          >
            <span>🚪</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* First Login Notification Banner */}
        {isFirstLogin && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-cyan-500/5 border border-cyan-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-xs font-bold text-cyan-900">First-Time Login: Set Your New Password</p>
                <p className="text-xs text-cyan-800">
                  Your default login password was set to your name (<strong>{currentUser?.name}</strong>). Please update it to your personal password.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap"
            >
              Change Password Now →
            </button>
          </div>
        )}

        {/* Status Alert Banner */}
        {isActive ? (
          <div className="p-4 rounded-2xl bg-teal-50/90 border border-teal-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-xs font-bold text-teal-800">Active Membership Pass</p>
                <p className="text-xs text-teal-700">
                  {daysRemaining !== null && daysRemaining > 0
                    ? `Your membership is valid for another ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.`
                    : 'Your membership is active for today.'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-black uppercase tracking-wider">
              VALID
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-xs font-bold text-rose-800">Membership Expired / Due</p>
                <p className="text-xs text-rose-700">
                  Please visit the gym front desk or contact admin to renew your package.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-black uppercase tracking-wider">
              EXPIRED
            </span>
          </div>
        )}

        {/* Digital Gym ID Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/30 border-2 border-cyan-200 shadow-xl shadow-cyan-500/10 p-6 sm:p-8">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Card Top */}
          <div className="flex items-center justify-between border-b border-cyan-100/80 pb-5 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-cyan-500/25">
                🏋️
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base tracking-wider uppercase">GYM MEMBER DIGITAL PASS</h3>
                <p className="text-[10px] text-cyan-700 font-bold tracking-widest uppercase">Official Member Access Pass</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Member ID</span>
              <span className="text-xs font-mono font-bold text-cyan-700">
                #{currentUser?.id || currentUser?._id ? (currentUser.id || currentUser._id).slice(-8).toUpperCase() : 'MEM-001'}
              </span>
            </div>
          </div>

          {/* Member Card Body */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Edit Overlay */}
            <div className="relative group cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
              {currentUser?.profilePic ? (
                <img
                  src={currentUser.profilePic}
                  alt={currentUser?.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-3xl shadow-md border-2 border-cyan-300">
                  {initials}
                </div>
              )}

              <div className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold">
                <span>📷</span>
                <span>Edit Photo</span>
              </div>

              <span
                className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-md ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-teal-500/20'
                    : 'bg-rose-500 text-white shadow-rose-500/20'
                }`}
              >
                {isActive ? 'Active' : 'Expired'}
              </span>
            </div>

            {/* Info Columns */}
            <div className="flex-1 space-y-4 text-center sm:text-left">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-2xl font-black text-slate-900">{currentUser?.name || 'Member'}</h2>
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    className="self-center sm:self-auto text-xs font-bold text-cyan-600 hover:text-cyan-700 bg-white/80 hover:bg-white px-3 py-1 rounded-xl border border-cyan-200 transition-all shadow-2xs"
                  >
                    ✏️ Edit Details
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  📞 {currentUser?.mobileNo || 'N/A'} &nbsp;|&nbsp; ✉️ {currentUser?.email || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-white/90 border border-cyan-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Plan</span>
                  <span className="text-xs font-bold text-cyan-700">
                    {currentUser?.membershipPlan || 'Standard Plan'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/90 border border-cyan-100 shadow-xs">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Joined On</span>
                  <span className="text-xs font-bold text-slate-800">{formatDate(currentUser?.joiningDate)}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/90 border border-cyan-100 shadow-xs col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Valid Till</span>
                  <span className={`text-xs font-bold ${isActive ? 'text-teal-600' : 'text-rose-600'}`}>
                    {formatDate(currentUser?.nextBillDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Bottom / Barcode Strip */}
          <div className="mt-8 pt-4 border-t border-cyan-100/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <div className="font-mono tracking-widest text-[11px] opacity-70">
              ||| | |||| | ||| |||| | || |||| | |||
            </div>
            <div className="text-[11px] text-slate-500">
              Paid Amount: <strong className="text-slate-900">₹{currentUser?.amountPaid || '0'}</strong>
            </div>
          </div>
        </div>

        {/* Additional Details & Gym Facilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Membership Details */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700">Plan Summary</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Package Duration</span>
                <span className="font-semibold text-slate-900">{currentUser?.membershipMonths || 1} Month(s)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-semibold text-teal-600">₹{currentUser?.amountPaid || '0'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Gender</span>
                <span className="font-semibold text-slate-900">{currentUser?.gender || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Address</span>
                <span className="font-semibold text-slate-900">{currentUser?.address || 'Local'}</span>
              </div>
            </div>
          </div>

          {/* Gym Timings & Help */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700">Gym Info & Timings</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Morning Slot</span>
                <span className="font-semibold text-slate-900">06:00 AM - 11:00 AM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Evening Slot</span>
                <span className="font-semibold text-slate-900">04:00 PM - 10:00 PM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Sunday</span>
                <span className="font-semibold text-cyan-700">07:00 AM - 01:00 PM</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                Need renewal or personal training? Contact gym front desk.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Member Profile & Password Modal */}
      <MemberProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        memberUser={currentUser}
        onMemberUpdated={handleMemberUpdated}
      />
    </div>
  );
};
