import React, { useState, useEffect, useCallback } from 'react';
import { membersAPI } from '../../services/api';
import { MemberDetailsModal } from './MemberDetailsModal';
import { TrainerProfileModal } from './TrainerProfileModal';

export const TrainerView = ({ trainerUser, onLogout }) => {
  const [currentUser, setCurrentUser] = useState(trainerUser);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [viewingMember, setViewingMember] = useState(null);

  const isFirstLogin = currentUser?.isFirstLogin !== false;

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const res = await membersAPI.getAll(search, statusFilter);
    setLoading(false);
    if (res.success && Array.isArray(res.data)) {
      setMembers(res.data);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const initials = currentUser?.userName
    ? currentUser.userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'T';

  return (
    <div className="min-h-screen bg-[#F0F7F9] text-slate-800 font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200/90 px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-cyan-500/20">
            🏋️
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <span>{currentUser?.gymName || 'Gym Management'}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                TRAINER PORTAL
              </span>
            </h1>
            <p className="text-xs text-slate-500">Coach: {currentUser?.userName || 'Trainer'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-all flex items-center space-x-1.5"
          >
            <span>⚙️</span>
            <span>Edit Profile & Password</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center space-x-1"
          >
            <span>🚪 Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* First Login Security Banner */}
        {isFirstLogin && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-cyan-500/5 border border-cyan-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔒</span>
              <div>
                <p className="text-xs font-bold text-cyan-900">First-Time Login Security Setup</p>
                <p className="text-xs text-cyan-800">
                  Your temporary default password was set to your name (<strong>{currentUser?.userName}</strong>). Please update it to your personal password.
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

        {/* Coach Stat Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
              title="Click to change photo"
            >
              {currentUser?.profilePic ? (
                <img
                  src={currentUser.profilePic}
                  alt="Coach"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-cyan-200">
                  {initials}
                </div>
              )}
              <span className="absolute inset-0 bg-slate-900/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                📷 Edit
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900">{currentUser?.userName || 'Coach'}</h2>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-bold"
                >
                  ✏️
                </button>
              </div>
              <p className="text-xs text-cyan-600 font-semibold">{currentUser?.specialty || 'Strength & Conditioning'}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                ✉️ {currentUser?.email} {currentUser?.phone ? `| 📞 ${currentUser.phone}` : ''}
              </p>
            </div>
          </div>

          <div className="flex space-x-4 text-center">
            <div className="p-3 px-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Total Gym Members</span>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{members.length}</h3>
            </div>
            <div className="p-3 px-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Active Clients</span>
              <h3 className="text-2xl font-black text-teal-600 mt-0.5">
                {members.filter((m) => m.status === 'Active').length}
              </h3>
            </div>
          </div>
        </div>

        {/* Members Roster Table */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-black text-slate-900">Gym Members & Trainees</h3>
              <p className="text-xs text-slate-500">View member workout status & plan validity</p>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member..."
                className="w-56 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />

              <div className="flex space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
                {['All', 'Active', 'Expired'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      statusFilter === tab
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading members...</div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">No members found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Current Plan</th>
                    <th className="py-3 px-4">Joined On</th>
                    <th className="py-3 px-4">Expiry Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => {
                    const mInitials = m.name
                      ? m.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'M';

                    return (
                      <tr key={m._id} className="hover:bg-cyan-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-3">
                          {m.profilePic ? (
                            <img
                              src={m.profilePic}
                              alt={m.name}
                              className="w-8 h-8 rounded-xl object-cover border border-cyan-200"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs border border-cyan-200">
                              {mInitials}
                            </div>
                          )}
                          <span>{m.name}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono">{m.mobileNo}</td>
                        <td className="py-3.5 px-4 text-cyan-600 font-semibold">{m.membershipPlan}</td>
                        <td className="py-3.5 px-4 text-slate-500">{m.joiningDate}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{m.nextBillDate}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === 'Active'
                                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setViewingMember(m)}
                            className="px-2.5 py-1 text-xs font-bold text-cyan-600 hover:text-cyan-800 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-colors"
                          >
                            View Pass
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Member Details Modal */}
      <MemberDetailsModal
        member={viewingMember}
        onClose={() => setViewingMember(null)}
      />

      {/* Trainer Profile & Password Modal */}
      <TrainerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        trainerUser={currentUser}
        onTrainerUpdated={(updated) => setCurrentUser(updated)}
      />
    </div>
  );
};
