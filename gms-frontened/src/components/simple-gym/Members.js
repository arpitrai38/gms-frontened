import React, { useState, useEffect, useCallback } from 'react';
import { membersAPI } from '../../services/api';

export const Members = ({ onOpenAddMember, onViewMember, onRenewMember }) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const res = await membersAPI.getAll(search, statusFilter);
    setLoading(false);
    if (res.success) {
      setMembers(res.data);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove member "${name}" from gym records?`)) {
      const res = await membersAPI.delete(id);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m._id !== id));
      }
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">All Gym Members</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Directory of all registered joinees & active memberships</p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, plan..."
            className="flex-1 sm:w-64 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <button
            onClick={onOpenAddMember}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-sm shadow-cyan-500/20 transition-all flex items-center space-x-1 shrink-0 whitespace-nowrap"
          >
            <span>+</span>
            <span className="hidden sm:inline"> Add Member</span>
            <span className="sm:hidden"> Add</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar">
        {['All', 'Active', 'Expired'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === st
                ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {st} Members
          </button>
        ))}
      </div>

      {/* Members Table & Mobile Card View */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No members found matching your search.
          </div>
        ) : (
          <>
            {/* Desktop Full Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50/70">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Member</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Join Date</th>
                    <th className="py-3 px-4">Next Bill Date</th>
                    <th className="py-3 px-4">Fee Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
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
                      <td className="py-3.5 px-4 text-slate-500 max-w-[150px] truncate">{m.address || '—'}</td>
                      <td className="py-3.5 px-4 text-cyan-600 font-semibold">{m.membershipPlan}</td>
                      <td className="py-3.5 px-4 text-slate-500">{m.joiningDate}</td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{m.nextBillDate}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{m.amountPaid}</td>
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
                        <button
                          onClick={() => onRenewMember(m)}
                          className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleDelete(m._id, m.name)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List (below md) */}
            <div className="md:hidden space-y-3">
              {members.map((m) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3"
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
                        <p className="text-[11px] text-slate-500">📞 {m.mobileNo}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        m.status === 'Active'
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Plan:</span>
                      <span className="font-bold text-cyan-700">{m.membershipPlan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Next Bill:</span>
                      <span className="font-semibold text-slate-800">{m.nextBillDate}</span>
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
                      className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 rounded-lg text-xs font-semibold"
                    >
                      Renew
                    </button>
                    <button
                      onClick={() => handleDelete(m._id, m.name)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold"
                    >
                      Delete
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
