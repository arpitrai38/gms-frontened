import React, { useState } from 'react';
import './App.css';

// Simple Gym Components matching CodingHunger Series & Multi-role Portals
import { Login } from './components/simple-gym/Login';
import { Sidebar } from './components/simple-gym/Sidebar';
import { Navbar } from './components/simple-gym/Navbar';
import { Dashboard } from './components/simple-gym/Dashboard';
import { Members } from './components/simple-gym/Members';
import { ExpiredMembers } from './components/simple-gym/ExpiredMembers';
import { Memberships } from './components/simple-gym/Memberships';
import { AddMemberModal } from './components/simple-gym/AddMemberModal';
import { MemberDetailsModal } from './components/simple-gym/MemberDetailsModal';
import { RenewModal } from './components/simple-gym/RenewModal';
import { ProfileModal } from './components/simple-gym/ProfileModal';
import { TrainerView } from './components/simple-gym/TrainerView';
import { MemberView } from './components/simple-gym/MemberView';
import { Attendance } from './components/simple-gym/Attendance';

import { Trainers } from './components/simple-gym/Trainers';

function App() {
  const [gymUser, setGymUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gym_app_user') || localStorage.getItem('gym_owner_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'attendance' | 'members' | 'trainers' | 'expired' | 'memberships'
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const [renewingMember, setRenewingMember] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLoginSuccess = (user, role) => {
    const userWithRole = { ...user, role: role || user.role || 'Admin' };
    localStorage.setItem('gym_app_user', JSON.stringify(userWithRole));
    setGymUser(userWithRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('gym_app_user');
    localStorage.removeItem('gym_owner_user');
    setGymUser(null);
    setActiveTab('dashboard');
  };

  const handleMemberAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleMemberRenewed = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // 1. If not logged in -> Show Multi-Role Login Form
  if (!gymUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const role = gymUser.role || 'Admin';

  // 2. If Trainer -> Show Trainer Portal
  if (role === 'Trainer') {
    return <TrainerView trainerUser={gymUser} onLogout={handleLogout} />;
  }

  // 3. If Member -> Show Member Digital Card & Pass
  if (role === 'Member') {
    return <MemberView memberUser={gymUser} onLogout={handleLogout} />;
  }

  // 4. Default: Admin Portal (Full Gym Management)
  return (
    <div className="min-h-screen bg-[#F0F7F9] text-slate-800 flex font-sans relative">
      {/* SIDEBAR (Desktop sticky + Mobile slide-over drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddMember={() => setIsAddModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        gymUser={gymUser}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F0F7F9] overflow-y-auto">
        {/* Top Navbar */}
        <Navbar
          title={
            activeTab === 'dashboard'
              ? 'Executive Gym Dashboard'
              : activeTab === 'attendance'
              ? 'Daily Attendance & Floor Occupancy'
              : activeTab === 'members'
              ? 'All Registered Members'
              : activeTab === 'trainers'
              ? 'Gym Trainers & Coaches'
              : activeTab === 'expired'
              ? 'Expired & Due Memberships'
              : 'Membership Packages'
          }
          onOpenAddMember={() => setIsAddModalOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        />

        {/* View Switcher (with bottom padding on mobile for bottom navigation bar) */}
        <main className="flex-1 pb-24 md:pb-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              key={refreshTrigger}
              onOpenAddMember={() => setIsAddModalOpen(true)}
              onViewMember={(m) => setViewingMember(m)}
              onRenewMember={(m) => setRenewingMember(m)}
            />
          )}

          {activeTab === 'attendance' && (
            <Attendance key={refreshTrigger} />
          )}

          {activeTab === 'members' && (
            <Members
              key={refreshTrigger}
              onOpenAddMember={() => setIsAddModalOpen(true)}
              onViewMember={(m) => setViewingMember(m)}
              onRenewMember={(m) => setRenewingMember(m)}
            />
          )}

          {activeTab === 'trainers' && (
            <Trainers key={refreshTrigger} />
          )}

          {activeTab === 'expired' && (
            <ExpiredMembers
              key={refreshTrigger}
              onViewMember={(m) => setViewingMember(m)}
              onRenewMember={(m) => setRenewingMember(m)}
            />
          )}

          {activeTab === 'memberships' && <Memberships key={refreshTrigger} />}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex justify-around items-center shadow-lg shadow-slate-900/10">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'attendance' ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-lg">📅</span>
          <span className="text-[10px]">Attendance</span>
        </button>

        {/* Center Floating Quick Add Member Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex flex-col items-center -mt-5"
          title="Add New Member"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform">
            +
          </div>
          <span className="text-[9px] font-bold text-cyan-700 mt-0.5">Add</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'members' ? 'text-cyan-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-lg">👥</span>
          <span className="text-[10px]">Members</span>
        </button>

        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
        >
          <span className="text-lg">⚙️</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>

      {/* MODALS */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMemberAdded={handleMemberAdded}
      />

      <MemberDetailsModal
        member={viewingMember}
        onClose={() => setViewingMember(null)}
        onRenewClick={(m) => setRenewingMember(m)}
        onMemberUpdated={() => setRefreshTrigger((prev) => prev + 1)}
      />

      <RenewModal
        isOpen={Boolean(renewingMember)}
        member={renewingMember}
        onClose={() => setRenewingMember(null)}
        onRenewed={handleMemberRenewed}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        gymUser={gymUser}
        onProfileUpdated={(updated) => setGymUser(updated)}
      />
    </div>
  );
}

export default App;
