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
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">Expired & Due Memberships</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {expiredMembers.length} Overdue
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
            Members whose membership billing period has expired. Click "Renew" to extend validity.
          </p>
        </div>
      </div>

      {/* Table & Mobile Cards */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Checking expired records...</div>
        ) : expiredMembers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            <span className="text-2xl block mb-2">🎉</span>
            Great news! No members have expired memberships right now.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {expiredMembers.map((m) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      {m.profilePic ? (
                        <img
                          src={m.profilePic}
                          alt={m.name}
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-xs border border-cyan-200 shrink-0">
                          {m.name ? m.name[0].toUpperCase() : 'M'}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{m.name}</p>
                        <p className="text-[10px] text-slate-500">📞 {m.mobileNo}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      Overdue
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] bg-white p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Plan:</span>
                      <span className="font-bold text-cyan-700">{m.membershipPlan}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Expired Date:</span>
                      <span className="font-bold text-rose-600">{m.nextBillDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-200/60">
                    <button
                      onClick={() => onViewMember(m)}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onRenewMember(m)}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      🔄 Renew
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
