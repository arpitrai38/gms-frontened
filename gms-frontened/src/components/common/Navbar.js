import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconSearch,
  IconBell,
  IconSmartphone,
  IconMonitor,
  IconQrCode,
  IconChevronDown,
  IconCheck
} from './Icons';

export const Navbar = ({ isCollapsed, onAddMemberClick }) => {
  const {
    currentUser,
    switchRole,
    logout,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentOccupancy,
    members
  } = useGym();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const unreadNotifications = notifications.filter(n => n.unread);

  // Search members on typing
  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const matched = members.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.membershipId.toLowerCase().includes(q) ||
        m.phone.includes(q)
      ).slice(0, 5);
      setSearchResults(matched);
    } else {
      setSearchResults([]);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Gym Dashboard';
      case 'members': return 'Member Directory & Profiles';
      case 'trainers': return 'Certified Trainers & Coaches';
      case 'memberships': return 'Tiered Membership Plans';
      case 'payments': return 'Financial Billing & Invoices';
      case 'attendance': return 'Live Floor Attendance & Logs';
      case 'workout': return 'Smart Workout Plans & Timer';
      case 'diet': return 'Nutrition & Macro Tracker';
      case 'progress': return 'Body Metrics & BMI Progress';
      case 'classes': return 'Weekly Classes & Timetable';
      case 'qr-attendance': return 'Digital QR Pass & Turnstile Scanner';
      case 'notifications': return 'System Alerts & Broadcasts';
      case 'reports': return 'Business Reports & CSV Exports';
      case 'analytics': return 'Analytics & Floor Intelligence';
      case 'audit-logs': return 'Security & Audit Event Ledger';
      default: return 'Gym Management System';
    }
  };

  return (
    <header className={`h-16 fixed top-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E9F7] px-4 lg:px-6 flex items-center justify-between transition-all duration-300 ${
      isCollapsed ? 'left-20' : 'left-64'
    }`}>
      {/* Left: Page Title & Search */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-base lg:text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
            {getPageTitle()}
          </h1>
        </div>

        {/* Global Search Bar with Autocomplete dropdown */}
        <div className="relative hidden xl:block w-72">
          <div className="relative">
            <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member, ID, phone..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#584CF4] focus:ring-1 focus:ring-[#584CF4] transition-all"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E9F7] rounded-2xl shadow-xl p-2 z-50">
              <div className="text-[10px] font-mono text-[#94A3B8] uppercase px-2 pb-1">Matched Members</div>
              {searchResults.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveTab('members');
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="flex items-center gap-2.5 p-2 hover:bg-[#F5F7FD] rounded-xl cursor-pointer transition-colors"
                >
                  <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-semibold text-[#111827] truncate">{m.name}</div>
                    <div className="text-[10px] text-[#64748B]">{m.membershipId} • {m.plan}</div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    m.status === 'Active' ? 'bg-[#E8F8F0] text-[#10B981]' : 'bg-[#FEECEB] text-[#EF4444]'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Telemetry, View Mode, Role Switcher, Notifications */}
      <div className="flex items-center gap-3">
        {/* Live Gym Occupancy Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F5F7FD] border border-[#E5E9F7]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#584CF4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#584CF4]"></span>
          </span>
          <div className="text-xs">
            <span className="text-[#64748B] font-mono">Floor: </span>
            <span className="font-bold text-[#111827] font-mono">{currentOccupancy}</span>
            <span className="text-[#64748B] font-mono"> / 120 In Gym</span>
          </div>
        </div>

        {/* View Mode Toggle: Desktop ERP vs Mobile Dribbble App */}
        <div className="flex items-center bg-[#F5F7FD] p-1 rounded-xl border border-[#E5E9F7]">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'desktop'
                ? 'bg-white text-[#584CF4] shadow-sm font-bold'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
            title="Full Desktop Management Console"
          >
            <IconMonitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Console</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'mobile'
                ? 'bg-[#584CF4] text-white font-bold shadow-[0_4px_12px_rgba(88,76,244,0.3)]'
                : 'text-[#64748B] hover:text-[#111827]'
            }`}
            title="FitFlow Mobile App View"
          >
            <IconSmartphone className="w-3.5 h-3.5" />
            <span>FitFlow App</span>
          </button>
        </div>

        {/* Quick QR Scanner Shortcut */}
        <button
          onClick={() => setActiveTab('qr-attendance')}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF0FE] hover:bg-[#E0E5F8] text-[#584CF4] rounded-xl text-xs font-semibold transition-all"
          title="Open Turnstile QR Scanner"
        >
          <IconQrCode className="w-4 h-4 text-[#584CF4]" />
          <span>Turnstile QR</span>
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl bg-[#F5F7FD] border border-[#E5E9F7] hover:border-[#584CF4]/50 text-[#64748B] hover:text-[#111827] transition-all"
          >
            <IconBell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5E9F7] rounded-3xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#111827]">Notifications</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#EEF0FE] text-[#584CF4] font-bold">
                    {unreadNotifications.length} New
                  </span>
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-[#64748B] hover:text-[#584CF4] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 my-3">
                {notifications.length === 0 ? (
                  <div className="text-center text-xs text-[#94A3B8] py-6">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        n.unread
                          ? 'bg-[#F5F7FD] border-[#584CF4]/30 text-[#111827]'
                          : 'bg-white border-[#E5E9F7] text-[#64748B]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1 text-[#111827]">
                        <span className="truncate">{n.title}</span>
                        <span className="text-[10px] text-[#94A3B8] font-mono ml-2 flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[#64748B] leading-relaxed text-[11px]">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setNotifDropdownOpen(false);
                  setActiveTab('notifications');
                }}
                className="w-full py-2 bg-[#EEF0FE] hover:bg-[#E0E5F8] text-center text-xs font-semibold text-[#584CF4] rounded-xl transition-colors"
              >
                View All Activity & Broadcasts →
              </button>
            </div>
          )}
        </div>

        {/* Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F7FD] hover:bg-[#EEF0FE] border border-[#E5E9F7] rounded-xl transition-all"
          >
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-mono text-[#94A3B8] uppercase">Role Demo</div>
              <div className="text-xs font-bold text-[#584CF4]">{currentUser.role}</div>
            </div>
            <IconChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E9F7] rounded-2xl shadow-2xl p-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
                Switch Role
              </div>
              {[
                { role: 'Admin', name: 'Alex Mercer', desc: 'Full ERP & Financial Control' },
                { role: 'Trainer', name: 'Viktor Vance', desc: 'Clients, Workouts & Schedules' },
                { role: 'Member', name: 'Elena Rostova', desc: 'Smart App, Pass & Macros' },
                { role: 'Receptionist', name: 'Maya Lin', desc: 'Front Desk & QR Turnstile' }
              ].map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    currentUser.role === r.role
                      ? 'bg-[#EEF0FE] text-[#584CF4] font-bold border border-[#584CF4]/30'
                      : 'text-[#475569] hover:bg-[#F5F7FD] hover:text-[#111827]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{r.role} — {r.name}</div>
                    <div className="text-[10px] text-[#94A3B8] font-normal">{r.desc}</div>
                  </div>
                  {currentUser.role === r.role && <IconCheck className="w-4 h-4 text-[#584CF4]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-sm"
          title="Logout and return to Home Page"
        >
          <span>Logout</span>
          <span>→</span>
        </button>
      </div>
    </header>
  );
};
