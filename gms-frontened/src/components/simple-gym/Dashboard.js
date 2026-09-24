import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';

export const Dashboard = ({ onOpenAddMember, onViewMember, onRenewMember }) => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,
    totalRevenue: 0
  });
  const [recentMembers, setRecentMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const res = await dashboardAPI.getStats();
    setLoading(false);
    if (res.success) {
      setStats(res.stats);
      setRecentMembers(res.recentMembers || []);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl font-bold">
            👥
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Members</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalMembers}</h3>
          </div>
        </div>

        {/* Active Members */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">
            🟢
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Members</p>
            <h3 className="text-2xl font-black text-teal-600 mt-0.5">{stats.activeMembers}</h3>
          </div>
        </div>

        {/* Expired Members */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl font-bold">
            ⚠️
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Expired / Due</p>
            <h3 className="text-2xl font-black text-rose-600 mt-0.5">{stats.expiredMembers}</h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
            ₹
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Collection</p>
            <h3 className="text-2xl font-black text-cyan-700 mt-0.5">₹{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* 2. RECENT MEMBERS LIST */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900">Recent Joinees</h2>
            <p className="text-xs text-slate-500">Newly registered gym members</p>
          </div>
          <button
            onClick={onOpenAddMember}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all"
          >
            + Add Member
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Loading dashboard stats...</div>
        ) : recentMembers.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No members registered yet. Click "+ Add Member" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50/70">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Member</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Join Date</th>
                  <th className="py-3 px-4">Next Bill Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentMembers.map((m) => (
                  <tr key={m._id} className="hover:bg-cyan-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-3">
                      {m.profilePic ? (
                        <img
                          src={m.profilePic}
                          alt={m.name}
                          className="w-8 h-8 rounded-xl object-cover border border-cyan-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-xs border border-cyan-200">
                          {m.name ? m.name[0].toUpperCase() : 'M'}
                        </div>
                      )}
                      <span>{m.name}</span>
                    </td>
                    <td className="py-3.5 px-4">{m.mobileNo}</td>
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
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onViewMember(m)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>
                      {m.status === 'Expired' && (
                        <button
                          onClick={() => onRenewMember(m)}
                          className="px-2.5 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                        >
                          Renew
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
