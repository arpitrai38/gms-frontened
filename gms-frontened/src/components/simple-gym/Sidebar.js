import React from 'react';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  onOpenAddMember,
  onLogout,
  gymUser,
  onOpenProfile,
  isMobileOpen = false,
  onCloseMobile
}) => {
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

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 shadow-2xl flex flex-col justify-between h-screen font-sans transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-64 lg:shadow-sm lg:z-20
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Gym Logo / Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-black shadow-md shadow-cyan-500/20 shrink-0">
                🏋️
              </div>
              <div className="truncate">
                <h2 className="text-sm font-black text-slate-900 tracking-tight truncate">
                  {gymUser?.gymName || 'GYM MANAGEMENT'}
                </h2>
                <p className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Admin Portal</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 ml-2"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>

          {/* Action Button: Add Member */}
          <div className="p-4">
            <button
              onClick={() => {
                onOpenAddMember();
                if (onCloseMobile) onCloseMobile();
              }}
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
                onClick={() => handleNavClick(item.id)}
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
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onOpenProfile();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center space-x-3 p-2 rounded-2xl hover:bg-white border border-transparent hover:border-cyan-100 transition-all text-left group"
            title="Click to edit profile, gym details or change password"
          >
            {gymUser?.profilePic ? (
              <img
                src={gymUser.profilePic}
                alt="User"
                className="w-10 h-10 rounded-xl object-cover border border-cyan-300 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-xs border border-cyan-200 shrink-0">
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
    </>
  );
};
