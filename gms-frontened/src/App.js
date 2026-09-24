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
    <div className="min-h-screen bg-[#F0F7F9] text-slate-800 flex font-sans">
      {/* SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddMember={() => setIsAddModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        gymUser={gymUser}
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
        />

        {/* View Switcher */}
        <main className="flex-1">
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
