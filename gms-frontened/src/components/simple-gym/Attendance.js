import React, { useState, useEffect, useCallback } from 'react';
import { attendanceAPI, membersAPI } from '../../services/api';

export const Attendance = () => {
  const [stats, setStats] = useState({ totalToday: 0, currentlyInside: 0, completedToday: 0 });
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [memberFilterText, setMemberFilterText] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch Today's Attendance or Selected Date Logs
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    const todayStr = new Date().toISOString().split('T')[0];

    if (selectedDate === todayStr) {
      const res = await attendanceAPI.getToday();
      if (res.success) {
        setStats(res.stats || { totalToday: 0, currentlyInside: 0, completedToday: 0 });
        setRecords(res.data || []);
      }
    } else {
      const res = await attendanceAPI.getHistory(selectedDate);
      if (res.success) {
        const data = res.data || [];
        setRecords(data);
        setStats({
          totalToday: data.length,
          currentlyInside: data.filter((r) => r.status === 'In Gym').length,
          completedToday: data.filter((r) => r.status === 'Completed').length
        });
      }
    }
    setLoading(false);
  }, [selectedDate]);

  // 2. Fetch all members for fast selection
  const fetchMembers = async () => {
    const res = await membersAPI.getAll();
    if (res.success) {
      setMembers(res.data || []);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle Fast Check-In
  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) {
      showToast('Please select a member to check in.', 'error');
      return;
    }

    setActionLoading(true);
    const res = await attendanceAPI.checkIn(selectedMemberId);
    setActionLoading(false);

    if (res.success) {
      showToast(res.message || 'Check-in successful!');
      setSelectedMemberId('');
      setMemberFilterText('');
      fetchAttendance();
    } else {
      showToast(res.message || 'Check-in failed.', 'error');
    }
  };

  // Handle Quick Check-Out
  const handleCheckOut = async (attendanceId) => {
    setActionLoading(true);
    const res = await attendanceAPI.checkOut(attendanceId);
    setActionLoading(false);

    if (res.success) {
      showToast(res.message || 'Member checked out!');
      fetchAttendance();
    } else {
      showToast(res.message || 'Check-out failed.', 'error');
    }
  };

  // Handle Delete Attendance entry
  const handleDelete = async (attendanceId, memberName) => {
    if (window.confirm(`Delete attendance log for ${memberName}?`)) {
      setActionLoading(true);
      const res = await attendanceAPI.delete(attendanceId);
      setActionLoading(false);
      if (res.success) {
        showToast('Log entry removed.');
        fetchAttendance();
      }
    }
  };

  // Filter members in dropdown list
  const filteredMemberList = members.filter((m) => {
    if (!memberFilterText.trim()) return true;
    const q = memberFilterText.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.mobileNo.includes(q) ||
      (m.membershipPlan && m.membershipPlan.toLowerCase().includes(q))
    );
  });

  // Selected member object for warning details
  const currentSelectedMember = members.find((m) => m._id === selectedMemberId);

  // Filter table records by search
  const filteredRecords = records.filter((r) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      r.memberName.toLowerCase().includes(q) ||
      r.mobileNo.includes(q) ||
      (r.membershipPlan && r.membershipPlan.toLowerCase().includes(q))
    );
  });

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold transition-all ${
            toast.type === 'error'
              ? 'bg-rose-50 border border-rose-200 text-rose-700'
              : 'bg-teal-50 border border-teal-200 text-teal-800'
          }`}
        >
          <span>{toast.type === 'error' ? '⚠️' : '✅'}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl font-bold">
            📅
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              {isToday ? "Today's Total Check-Ins" : 'Total Logged on Date'}
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalToday}</h3>
          </div>
        </div>

        {/* Currently in Gym */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold relative">
            🏋️
            {stats.currentlyInside > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-teal-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Currently on Gym Floor</p>
            <h3 className="text-2xl font-black text-teal-600 mt-0.5">
              {stats.currentlyInside} <span className="text-xs text-slate-400 font-normal">Active Athletes</span>
            </h3>
          </div>
        </div>

        {/* Completed Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center text-2xl font-bold">
            🏁
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Workouts</p>
            <h3 className="text-2xl font-black text-slate-700 mt-0.5">{stats.completedToday}</h3>
          </div>
        </div>
      </div>

      {/* 2. FAST FRONT DESK CHECK-IN BAR */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <span>⚡ Front Desk Fast Check-In</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                INSTANT
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Filter by name or mobile, select member, and record their gym floor entry timestamp
            </p>
          </div>
        </div>

        <form onSubmit={handleCheckIn} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Quick search filter to narrow down members */}
            <div className="sm:col-span-1">
              <input
                type="text"
                value={memberFilterText}
                onChange={(e) => setMemberFilterText(e.target.value)}
                placeholder="🔍 Type name or phone to filter..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Member Dropdown */}
            <div className="sm:col-span-2">
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="">
                  {filteredMemberList.length === 0
                    ? 'No matching members found'
                    : `-- Select Member (${filteredMemberList.length} available) --`}
                </option>
                {filteredMemberList.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.mobileNo}) — {m.membershipPlan} [{m.status}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Member Preview & Check-In Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="text-xs text-slate-500">
              {currentSelectedMember ? (
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">Selected: {currentSelectedMember.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      currentSelectedMember.status === 'Active'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {currentSelectedMember.status} Plan
                  </span>
                  {currentSelectedMember.status === 'Expired' && (
                    <span className="text-rose-600 font-semibold">(⚠️ Membership is expired)</span>
                  )}
                </div>
              ) : (
                <span>Pick a member above to proceed with check-in.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={actionLoading || !selectedMemberId}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>✓</span>
              <span>Confirm & Check In Now</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. ATTENDANCE ROSTER TABLE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              {isToday ? "Today's Attendance Roster" : `Attendance Records for ${selectedDate}`}
            </h3>
            <p className="text-xs text-slate-500">Live workout check-in / check-out timestamps</p>
          </div>

          {/* Controls: Date Picker & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="font-semibold">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 focus:bg-white"
              />
            </div>

            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search in table..."
              className="w-44 px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400 text-xs">Loading attendance logs...</div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <span className="text-2xl block mb-2">📋</span>
            No attendance entries logged for this date.
          </div>
        ) : (
          <>
            {/* Desktop Full Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] bg-slate-50/70">
                  <tr>
                    <th className="py-3 px-4 rounded-l-xl">Athlete / Member</th>
                    <th className="py-3 px-4">Mobile</th>
                    <th className="py-3 px-4">Plan</th>
                    <th className="py-3 px-4">Check-In Time</th>
                    <th className="py-3 px-4">Check-Out Time</th>
                    <th className="py-3 px-4">Floor Status</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((r) => (
                    <tr key={r._id} className="hover:bg-cyan-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center space-x-3">
                        {r.profilePic ? (
                          <img
                            src={r.profilePic}
                            alt={r.memberName}
                            className="w-8 h-8 rounded-xl object-cover border border-cyan-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-xs border border-cyan-200">
                            {r.memberName ? r.memberName[0].toUpperCase() : 'M'}
                          </div>
                        )}
                        <span>{r.memberName}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{r.mobileNo}</td>
                      <td className="py-3.5 px-4 text-cyan-600 font-semibold">{r.membershipPlan || 'General'}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{r.timeIn}</td>
                      <td className="py-3.5 px-4 text-slate-500">{r.timeOut || '— In Workout'}</td>
                      <td className="py-3.5 px-4">
                        {r.status === 'In Gym' ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                            <span>In Gym</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {r.status === 'In Gym' ? (
                          <button
                            onClick={() => handleCheckOut(r._id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                          >
                            🚪 Check Out
                          </button>
                        ) : (
                          <span className="text-[11px] text-teal-700 font-bold">Done ✓</span>
                        )}

                        <button
                          onClick={() => handleDelete(r._id, r.memberName)}
                          disabled={actionLoading}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-semibold transition-colors"
                          title="Delete accidental record"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {filteredRecords.map((r) => (
                <div
                  key={r._id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 truncate">
                      {r.profilePic ? (
                        <img
                          src={r.profilePic}
                          alt={r.memberName}
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-xs border border-cyan-200 shrink-0">
                          {r.memberName ? r.memberName[0].toUpperCase() : 'M'}
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate">{r.memberName}</p>
                        <p className="text-[10px] text-slate-500">📞 {r.mobileNo}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {r.status === 'In Gym' ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                          <span>In Gym</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Check-In:</span>
                      <span className="font-bold text-slate-800">{r.timeIn}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Check-Out:</span>
                      <span className="font-semibold text-slate-700">{r.timeOut || 'Active Now'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1 border-t border-slate-200/60">
                    {r.status === 'In Gym' ? (
                      <button
                        onClick={() => handleCheckOut(r._id)}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 text-white rounded-lg text-xs font-bold shadow-2xs"
                      >
                        🚪 Check Out
                      </button>
                    ) : (
                      <span className="text-[11px] text-teal-700 font-bold px-2 py-1">Done ✓</span>
                    )}
                    <button
                      onClick={() => handleDelete(r._id, r.memberName)}
                      disabled={actionLoading}
                      className="px-2 py-1 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-semibold"
                      title="Delete"
                    >
                      ✕
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
