import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconUsers,
  IconCreditCard,
  IconPlus,
  IconQrCode,
  IconActivity,
  IconShieldAlert,
  IconChevronRight
} from '../common/Icons';

export const AdminDashboard = ({ onOpenAddMember, onOpenRecordPayment, onOpenBroadcast }) => {
  const {
    members,
    payments,
    attendanceLogs,
    currentOccupancy,
    plans,
    setActiveTab,
    openInvoice
  } = useGym();

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const monthlyRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.total, 0);

  const pendingPaymentsCount = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').length;

  const peakHours = [
    { hour: '6 AM', count: 18 },
    { hour: '7 AM', count: 42 },
    { hour: '8 AM', count: 58 },
    { hour: '9 AM', count: 35 },
    { hour: '12 PM', count: 48 },
    { hour: '2 PM', count: 24 },
    { hour: '4 PM', count: 45 },
    { hour: '5 PM', count: 76 },
    { hour: '6 PM', count: 92 },
    { hour: '7 PM', count: 84 },
    { hour: '8 PM', count: 50 },
    { hour: '9 PM', count: 22 },
  ];

  const maxPeak = Math.max(...peakHours.map(p => p.count));

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Bar (FitFlow Gradient) */}
      <div className="relative rounded-3xl p-6 lg:p-8 bg-gradient-to-r from-[#584CF4] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_15px_35px_rgba(88,76,244,0.25)] overflow-hidden">
        {/* Soft Ambient Light Glows */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-[#A78BFA]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-white/20 text-white backdrop-blur-md">
                FITFLOW CLUB PLATFORM
              </span>
              <span className="text-xs text-white/80 font-mono">Real-time Telemetry</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight font-display">
              FitFlow Performance Club HQ
            </h2>
            <p className="text-xs lg:text-sm text-white/80 mt-1 max-w-xl leading-relaxed">
              Real-time floor occupancy, contactless turnstile access, athlete conditioning rosters, and billing ledger.
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddMember}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-[#584CF4] font-bold rounded-2xl text-xs flex items-center gap-2 shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <IconPlus className="w-4 h-4 text-[#584CF4]" />
              Add Member
            </button>

            <button
              onClick={() => setActiveTab('qr-attendance')}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold rounded-2xl text-xs flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <IconQrCode className="w-4 h-4 text-white" />
              QR Check-in
            </button>

            <button
              onClick={onOpenRecordPayment}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold rounded-2xl text-xs flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <IconCreditCard className="w-4 h-4 text-white" />
              Record Payment
            </button>

            <button
              onClick={onOpenBroadcast}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold rounded-2xl text-xs flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <span>📢</span>
              Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Active Members */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)] hover:shadow-[0_14px_35px_rgba(88,76,244,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider font-semibold">Active Athletes</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EEF0FE] text-[#584CF4] flex items-center justify-center group-hover:scale-105 transition-transform">
              <IconUsers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#111827] font-display">{activeMembers}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-[#10B981] font-bold font-mono">+{((activeMembers / totalMembers) * 100).toFixed(0)}%</span>
              <span className="text-[#64748B]">of {totalMembers} registered</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Live Gym Floor Occupancy */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)] hover:shadow-[0_14px_35px_rgba(88,76,244,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider font-semibold">Floor Occupancy</span>
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center group-hover:scale-105 transition-transform">
              <IconActivity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#111827] font-display">{currentOccupancy}</span>
              <span className="text-sm font-mono text-[#64748B]">/ 120 Max</span>
            </div>
            <div className="w-full bg-[#F5F7FD] rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#584CF4] to-[#7C3AED] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentOccupancy / 120) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Monthly Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)] hover:shadow-[0_14px_35px_rgba(88,76,244,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider font-semibold">Monthly Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EEF0FE] text-[#584CF4] flex items-center justify-center group-hover:scale-105 transition-transform">
              <IconCreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#111827] font-display">
              ${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-[#10B981] font-bold font-mono">+8.4%</span>
              <span className="text-[#64748B]">vs previous period</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Invoices */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)] hover:shadow-[0_14px_35px_rgba(88,76,244,0.1)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider font-semibold">Pending Invoices</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FEECEB] text-[#EF4444] flex items-center justify-center group-hover:scale-105 transition-transform">
              <IconShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#111827] font-display">{pendingPaymentsCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-[#EF4444] font-bold font-mono">Action Required</span>
              <span className="text-[#64748B]">under recovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Row: Peak Hours & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Peak Hours Bar Chart & Membership Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Peak Hours Chart */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#111827] tracking-tight">Daily Gym Occupancy Trends</h3>
                <p className="text-xs text-[#64748B]">Hourly athlete density pattern based on turnstile sensors</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EEF0FE] text-xs font-mono text-[#584CF4] font-bold">
                Peak Time: 6:00 PM (92 Active)
              </span>
            </div>

            {/* Bar Chart */}
            <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#E5E9F7]">
              {peakHours.map((item, idx) => {
                const heightPercent = Math.round((item.count / maxPeak) * 100);
                const isTopPeak = item.count === maxPeak;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#111827] text-[10px] font-mono font-bold text-white px-2 py-1 rounded-lg shadow-lg pointer-events-none whitespace-nowrap z-20">
                      {item.count} check-ins
                    </div>

                    <div className="w-full h-40 flex items-end justify-center">
                      <div
                        className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 ${
                          isTopPeak
                            ? 'bg-gradient-to-t from-[#584CF4] to-[#7C3AED] shadow-[0_4px_12px_rgba(88,76,244,0.4)]'
                            : 'bg-[#EEF0FE] hover:bg-[#584CF4]/40'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#64748B] truncate">{item.hour}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B] mt-4 px-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#584CF4] inline-block" />
                <span>Peak Rush Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-[#EEF0FE] inline-block" />
                <span>Standard Traffic</span>
              </div>
            </div>
          </div>

          {/* Membership Tier Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111827]">Membership Plan Popularity</h3>
              <button
                onClick={() => setActiveTab('memberships')}
                className="text-xs text-[#584CF4] hover:underline flex items-center gap-1 font-bold"
              >
                View Plans <IconChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#64748B] truncate">{p.name}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#584CF4]" />
                  </div>
                  <div className="text-xl font-black text-[#111827] font-display">{p.activeMembers}</div>
                  <div className="text-[11px] text-[#64748B] font-mono mt-0.5">${p.price}/mo</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Check-in Activity & Recent Transactions */}
        <div className="space-y-6">
          {/* Live Check-In Stream */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#584CF4] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#584CF4]"></span>
                </span>
                <h3 className="text-base font-bold text-[#111827]">Live Floor Feed</h3>
              </div>
              <button
                onClick={() => setActiveTab('attendance')}
                className="text-xs text-[#584CF4] hover:underline font-bold"
              >
                All Logs
              </button>
            </div>

            <div className="space-y-3">
              {attendanceLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7]">
                  <img src={log.avatar} alt={log.memberName} className="w-10 h-10 rounded-2xl object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold text-[#111827] truncate">{log.memberName}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">
                      {log.timeIn} • {log.plan}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    log.status === 'In Gym' ? 'bg-[#E8F8F0] text-[#10B981]' : 'bg-[#EEF0FE] text-[#584CF4]'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Invoices & Payments */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111827]">Recent Transactions</h3>
              <button
                onClick={() => setActiveTab('payments')}
                className="text-xs text-[#584CF4] hover:underline font-bold"
              >
                Invoices
              </button>
            </div>

            <div className="space-y-3">
              {payments.slice(0, 4).map((pay) => (
                <div
                  key={pay.id}
                  onClick={() => openInvoice(pay)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7] hover:border-[#584CF4]/40 cursor-pointer transition-all"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="text-xs font-semibold text-[#111827] truncate">{pay.memberName}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{pay.invoiceNumber} • {pay.date}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-[#111827] font-mono">${pay.total.toFixed(2)}</div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      pay.status === 'Paid' ? 'bg-[#E8F8F0] text-[#10B981]' : 'bg-[#FEECEB] text-[#EF4444]'
                    }`}>
                      {pay.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
