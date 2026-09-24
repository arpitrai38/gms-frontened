import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconSearch,
  IconUserCheck,
  IconCheck
} from '../common/Icons';

export const AttendanceTracking = () => {
  const { attendanceLogs, checkInMember, checkOutMember, currentOccupancy, members } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [memberInputId, setMemberInputId] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!memberInputId.trim()) return;

    const res = checkInMember(memberInputId.trim(), 'Desk Manual Check-in');
    showToast(res.message);
    setMemberInputId('');
  };

  const filteredLogs = attendanceLogs.filter((log) => {
    const matchesSearch =
      log.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.plan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || log.date === selectedDate;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-white border border-[#584CF4] text-[#584CF4] font-bold shadow-2xl flex items-center gap-2">
          <IconCheck className="w-5 h-5 text-[#584CF4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#111827] tracking-tight font-display">
            Live Gym Floor Attendance & Logs
          </h2>
          <p className="text-xs text-[#64748B]">
            Real-time contactless turnstile logs, manual front-desk sign-ins, and floor occupancy tracking.
          </p>
        </div>

        {/* Live occupancy badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-[#E5E9F7] shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#584CF4] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#584CF4]"></span>
          </span>
          <div>
            <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest font-semibold">Active Floor Density</div>
            <div className="text-base font-black text-[#111827] font-display">
              {currentOccupancy} Athletes Inside <span className="text-xs text-[#64748B] font-mono">/ 120 Max</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Check-in Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-sm">
        <h3 className="text-sm font-bold text-[#111827] mb-1 flex items-center gap-2">
          <IconUserCheck className="w-4 h-4 text-[#584CF4]" /> Front Desk Fast Check-In
        </h3>
        <p className="text-xs text-[#64748B] mb-4">
          Scan RFID barcode or enter athlete name / Member ID (e.g. APX-8820) for instant check-in.
        </p>

        <form onSubmit={handleManualCheckIn} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Member ID (APX-8820) or athlete name..."
              value={memberInputId}
              onChange={(e) => setMemberInputId(e.target.value)}
              className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#584CF4]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all whitespace-nowrap"
          >
            Check In / Out
          </button>
        </form>

        {/* Quick Click Athletes */}
        <div className="mt-4 pt-3 border-t border-[#E5E9F7] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-mono text-[#64748B] flex-shrink-0">Quick Tap:</span>
          {members.slice(0, 5).map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                const res = checkInMember(m.id, 'Desk Quick Tap');
                showToast(res.message);
              }}
              className="px-3 py-1 rounded-xl bg-[#F5F7FD] hover:bg-[#EEF0FE] text-[#475569] hover:text-[#584CF4] text-[11px] font-mono flex-shrink-0 transition-colors border border-[#E5E9F7]"
            >
              + {m.name.split(' ')[0]} ({m.membershipId})
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Date selector */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5E9F7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search athlete in log..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#584CF4]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-[#64748B] font-mono">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#584CF4] font-mono"
          />
        </div>
      </div>

      {/* Attendance Logs Table */}
      <div className="bg-white rounded-3xl border border-[#E5E9F7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FD] border-b border-[#E5E9F7] text-[#64748B] font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Athlete</th>
                <th className="py-3.5 px-4">Tier Plan</th>
                <th className="py-3.5 px-4">Time In</th>
                <th className="py-3.5 px-4">Time Out</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F7] text-[#334155]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#94A3B8]">
                    No attendance logs recorded for selected date.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img src={log.avatar} alt={log.memberName} className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#EEF0FE]" />
                        <span className="font-semibold text-[#111827]">{log.memberName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {log.plan}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#584CF4] font-bold">
                      {log.timeIn}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {log.timeOut || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#334155]">
                      {log.duration}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px]">
                      {log.method}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono inline-block ${
                        log.status === 'In Gym'
                          ? 'bg-[#E8F8F0] text-[#10B981]'
                          : 'bg-[#EEF0FE] text-[#584CF4]'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {log.status === 'In Gym' ? (
                        <button
                          onClick={() => {
                            const res = checkOutMember(log.id);
                            showToast(res.message);
                          }}
                          className="px-3 py-1 bg-[#FEECEB] hover:bg-[#EF4444] text-[#EF4444] hover:text-white rounded-xl text-xs font-bold font-mono transition-colors"
                        >
                          Clock Out
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#94A3B8]">Logged</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
