import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconDashboard,
  IconUsers,
  IconTrainer,
  IconBadgeCheck,
  IconCreditCard,
  IconCalendar,
  IconDumbbell,
  IconApple,
  IconTrendingUp,
  IconActivity,
  IconQrCode,
  IconBell,
  IconFileText,
  IconShieldAlert,
  IconSmartphone
} from './Icons';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { activeTab, setActiveTab, currentUser, notifications, setViewMode } = useGym();

  const unreadCount = notifications.filter(n => n.unread).length;

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Admin Dashboard', icon: IconDashboard },
      ]
    },
    {
      title: 'PHASE 1 — CORE',
      items: [
        { id: 'members', label: 'Member Management', icon: IconUsers },
        { id: 'trainers', label: 'Trainer Management', icon: IconTrainer },
        { id: 'memberships', label: 'Membership Plans', icon: IconBadgeCheck },
        { id: 'payments', label: 'Payments & Invoices', icon: IconCreditCard },
        { id: 'attendance', label: 'Attendance Tracking', icon: IconCalendar },
      ]
    },
    {
      title: 'PHASE 2 — FITNESS',
      items: [
        { id: 'workout', label: 'Workout Planner', icon: IconDumbbell },
        { id: 'diet', label: 'Diet & Nutrition', icon: IconApple },
        { id: 'progress', label: 'Progress Tracking', icon: IconTrendingUp },
        { id: 'classes', label: 'Classes & Schedule', icon: IconActivity },
      ]
    },
    {
      title: 'PHASE 3 — PROFESSIONAL',
      items: [
        { id: 'qr-attendance', label: 'QR Pass & Scanner', icon: IconQrCode },
        { id: 'notifications', label: 'Notifications', icon: IconBell, badge: unreadCount },
        { id: 'reports', label: 'Reports & Exports', icon: IconFileText },
        { id: 'analytics', label: 'Analytics & BI', icon: IconTrendingUp },
        { id: 'audit-logs', label: 'Audit Logs', icon: IconShieldAlert },
      ]
    }
  ];

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-[#E5E9F7] flex flex-col shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* FitFlow Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5E9F7] bg-white">
        <div className="flex items-center gap-2.5 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-[#EEF0FE] flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
              <path d="M5 16C8 10 13 8 18 10C24 12.5 27 9 29 7" stroke="#584CF4" strokeWidth="3" strokeLinecap="round"/>
              <path d="M3 21C6 15 11 13 16 15C22 17.5 25 14 27 12" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.7"/>
            </svg>
          </div>
          {!isCollapsed && (
            <div className="leading-tight">
              <span className="font-display font-black text-xl tracking-tight text-[#111827]">
                Fit<span className="text-[#584CF4]">Flow</span>
              </span>
              <span className="block text-[10px] tracking-wider text-[#64748B] font-mono uppercase font-semibold">
                Fitness & Nutrition
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#94A3B8] hover:text-[#584CF4] p-1.5 rounded-xl hover:bg-[#F5F7FD] transition-colors hidden md:block"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase font-bold">
                {section.title}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-[#584CF4] text-white shadow-[0_8px_20px_-4px_rgba(88,76,244,0.4)]'
                        : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F5F7FD]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#584CF4]'
                    }`} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {item.badge > 0 && !isCollapsed && (
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive ? 'bg-white text-[#584CF4]' : 'bg-[#EF4444] text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && item.badge > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* FitFlow Mobile Launcher Card */}
      {!isCollapsed && (
        <div className="p-3.5 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#EEF0FE] to-[#F5F7FD] border border-[#E0E5F8]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#584CF4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#584CF4]"></span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#584CF4] uppercase tracking-wider">
              FitFlow Mobile UI
            </span>
          </div>
          <p className="text-xs text-[#64748B] mb-2.5">
            Preview the exact purple & lilac mobile app.
          </p>
          <button
            onClick={() => setViewMode('mobile')}
            className="w-full py-2 px-3 bg-[#584CF4] hover:bg-[#483BE0] text-white rounded-xl text-xs font-bold shadow-[0_4px_12px_rgba(88,76,244,0.3)] transition-all flex items-center justify-center gap-2"
          >
            <IconSmartphone className="w-4 h-4" />
            Open FitFlow App
          </button>
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#E5E9F7] bg-white">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#F5F7FD]">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#584CF4]/30 flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-[#111827] truncate leading-tight">{currentUser.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#EEF0FE] text-[#584CF4] font-bold">
                  {currentUser.role}
                </span>
                <span className="text-[10px] text-[#64748B] truncate">{currentUser.title}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
