import React from 'react';

export const Sidebar = ({ activeTab, setActiveTab, onOpenAddMember, onLogout, gymUser, onOpenProfile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Daily Attendance', icon: '📅' },
    { id: 'members', label: 'All Members', icon: '👥' },
    { id: 'trainers', label: 'Gym Trainers', icon: '🏋️‍♂️' },
    { id: 'expired', label: 'Expired Members', icon: '⚠️' },
    { id: 'memberships', label: 'Membership Plans', icon: '💳' },
  ];

  const userInitials = gymUser?.userName
    ? gymUser.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'A';

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 shadow-sm flex flex-col justify-between h-screen sticky top-0 font-sans z-20">
      <div>
        {/* Gym Logo / Header */}
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-black shadow-md shadow-cyan-500/20">
            🏋️
          </div>
          <div className="truncate">
            <h2 className="text-sm font-black text-slate-900 tracking-tight truncate">
              {gymUser?.gymName || 'GYM MANAGEMENT'}
            </h2>
            <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>

        {/* Action Button: Add Member */}
        <div className="p-4">
          <button
            onClick={onOpenAddMember}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-black text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>+</span>
            <span>Add New Member</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Footer & Profile Edit */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-2">
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-full flex items-center space-x-3 p-2 rounded-2xl hover:bg-white border border-transparent hover:border-cyan-100 transition-all text-left group"
          title="Click to edit profile, gym details or change password"
        >
          {gymUser?.profilePic ? (
            <img
              src={gymUser.profilePic}
              alt="User"
              className="w-10 h-10 rounded-xl object-cover border border-cyan-300 shadow-xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-xs border border-cyan-200">
              {userInitials}
            </div>
          )}

          <div className="truncate flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-cyan-700">
                {gymUser?.userName || 'Admin'}
              </p>
              <span className="text-[10px] text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{gymUser?.email}</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2 px-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 border border-rose-200 transition-all flex items-center justify-center space-x-1.5"
        >
          <span>🚪 Logout</span>
        </button>
      </div>
    </aside>
  );
};
