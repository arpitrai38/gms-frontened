import React, { useState, useEffect, useCallback } from 'react';
import { membersAPI } from '../../services/api';

export const ExpiredMembers = ({ onRenewMember, onViewMember }) => {
  const [expiredMembers, setExpiredMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpired = useCallback(async () => {
    setLoading(true);
    const res = await membersAPI.getAll('', 'Expired');
    setLoading(false);
    if (res.success) {
      setExpiredMembers(res.data);
    }
  }, []);

  useEffect(() => {
    fetchExpired();
  }, [fetchExpired]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900">Expired & Due Memberships</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {expiredMembers.length} Overdue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Members whose membership billing period has expired. Click "Renew" to extend validity.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Checking expired records...</div>
        ) : expiredMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <span className="text-2xl block mb-2">🎉</span>
            Great news! No members have expired memberships right now.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50/70">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Member Name</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">Previous Plan</th>
                  <th className="py-3 px-4">Joining Date</th>
                  <th className="py-3 px-4">Expired On</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Quick Renewal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiredMembers.map((m) => (
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
                    <td className="py-3.5 px-4 font-mono">{m.mobileNo}</td>
                    <td className="py-3.5 px-4 text-cyan-600 font-semibold">{m.membershipPlan}</td>
                    <td className="py-3.5 px-4 text-slate-500">{m.joiningDate}</td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">{m.nextBillDate}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Expired
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => onViewMember(m)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onRenewMember(m)}
                        className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-xl text-xs font-black shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
                      >
                        🔄 Renew Now
                      </button>
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
