import React from 'react';
import { useGym } from '../../context/GymContext';

export const AnalyticsView = () => {
  const { members, plans } = useGym();

  const monthlyFinancials = [
    { month: 'Apr', revenue: 32000, expenses: 14000 },
    { month: 'May', revenue: 36500, expenses: 15200 },
    { month: 'Jun', revenue: 41000, expenses: 16000 },
    { month: 'Jul', revenue: 44200, expenses: 17100 },
    { month: 'Aug', revenue: 46800, expenses: 17800 },
    { month: 'Sep', revenue: 52400, expenses: 18500 },
  ];

  const maxRev = Math.max(...monthlyFinancials.map(f => f.revenue));

  const memberGrowth = [
    { month: 'Apr', newMembers: 38, churn: 6 },
    { month: 'May', newMembers: 46, churn: 8 },
    { month: 'Jun', newMembers: 58, churn: 5 },
    { month: 'Jul', newMembers: 64, churn: 9 },
    { month: 'Aug', newMembers: 72, churn: 7 },
    { month: 'Sep', newMembers: 85, churn: 4 },
  ];

  const maxGrowth = Math.max(...memberGrowth.map(m => m.newMembers));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight font-display">
            Business Intelligence & Analytics
          </h2>
          <p className="text-xs text-slate-500">
            Revenue velocity, operational gross margins, athlete retention rates, and facility utilization.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#E5E9F7] text-xs font-mono text-fitflow-primary font-bold shadow-soft">
          <span>Reporting Period: Q2 - Q3 2026</span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-soft hover:shadow-soft-lg transition-all">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Gross Annualized Run Rate</span>
          <div className="text-3xl font-black text-slate-900 font-display mt-2">$628,800</div>
          <div className="text-xs font-mono text-[#10B981] mt-2 font-bold bg-[#E8F8F0] px-2.5 py-1 rounded-lg inline-block">
            +18.4% YoY Growth
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-soft hover:shadow-soft-lg transition-all">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Athlete Retention Rate</span>
          <div className="text-3xl font-black text-[#584CF4] font-display mt-2">94.8%</div>
          <div className="text-xs font-mono text-slate-500 mt-2 bg-[#EEF0FE] text-[#584CF4] px-2.5 py-1 rounded-lg inline-block font-bold">
            Industry benchmark: 82%
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-soft hover:shadow-soft-lg transition-all">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Avg Rev Per User (ARPU)</span>
          <div className="text-3xl font-black text-slate-900 font-display mt-2">$142.50</div>
          <div className="text-xs font-mono text-slate-500 mt-2 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
            Across all active tiers
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-soft hover:shadow-soft-lg transition-all">
          <span className="text-xs font-mono text-slate-400 uppercase font-semibold">Facility Operating Margin</span>
          <div className="text-3xl font-black text-[#10B981] font-display mt-2">64.7%</div>
          <div className="text-xs font-mono text-slate-500 mt-2 bg-[#E8F8F0] text-[#10B981] px-2.5 py-1 rounded-lg inline-block font-bold">
            Net profit after leases
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Trajectory */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue vs Operating Costs</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of gross receipts vs operating overhead</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-medium">
              <span className="flex items-center gap-1.5 text-[#584CF4]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#584CF4]" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-[#EF4444]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> Expenses
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-[#E5E9F7]">
            {monthlyFinancials.map((item, idx) => {
              const revH = Math.round((item.revenue / maxRev) * 100);
              const expH = Math.round((item.expenses / maxRev) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Revenue Bar */}
                    <div
                      className="w-full max-w-[20px] bg-gradient-to-t from-[#584CF4] to-[#7C3AED] rounded-t-md shadow-glow-primary group-hover:brightness-110 transition-all cursor-pointer"
                      style={{ height: `${revH}%` }}
                      title={`Revenue: $${item.revenue.toLocaleString()}`}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-full max-w-[20px] bg-[#FEECEB] border border-[#EF4444]/30 rounded-t-md group-hover:brightness-105 transition-all cursor-pointer"
                      style={{ height: `${expH}%` }}
                      title={`Expenses: $${item.expenses.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-slate-500 mt-4">
            <span>Net Monthly Profit (Sep): <strong className="text-[#584CF4]">$33,900</strong></span>
            <span>Profit Margin: <strong className="text-slate-900">64.7%</strong></span>
          </div>
        </div>

        {/* Member Acquisition vs Churn */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Member Acquisition & Churn</h3>
              <p className="text-xs text-slate-400">Net monthly growth vs membership cancellations</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-medium">
              <span className="flex items-center gap-1.5 text-[#10B981]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /> New Signups
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Cancellations
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-[#E5E9F7]">
            {memberGrowth.map((item, idx) => {
              const signH = Math.round((item.newMembers / maxGrowth) * 100);
              const churnH = Math.round((item.churn / maxGrowth) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    <div
                      className="w-full max-w-[20px] bg-gradient-to-t from-[#10B981] to-[#34D399] rounded-t-md shadow-soft transition-all cursor-pointer"
                      style={{ height: `${signH}%` }}
                      title={`New: ${item.newMembers}`}
                    />
                    <div
                      className="w-full max-w-[20px] bg-slate-200 rounded-t-md transition-all cursor-pointer"
                      style={{ height: `${churnH}%` }}
                      title={`Churn: ${item.churn}`}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">{item.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-slate-500 mt-4">
            <span>Net Growth (Sep): <strong className="text-[#10B981]">+81 Athletes</strong></span>
            <span>Churn Rate: <strong className="text-slate-900 font-bold">4.7% (Low)</strong></span>
          </div>
        </div>
      </div>

      {/* Plan Revenue Distribution Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-4">Subscription Distribution & Cohorts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((p) => {
            const count = members.filter(m => m.plan.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])).length || p.activeMembers || 1;
            const revenue = count * p.price;
            return (
              <div key={p.id} className="p-4 rounded-2xl bg-[#F8FAFF] border border-[#E5E9F7] hover:bg-white hover:shadow-soft transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">{p.name}</span>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color || '#584CF4' }} />
                </div>
                <div className="text-2xl font-black text-slate-900 font-display">${revenue.toLocaleString()}</div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  {count} athletes • ${p.price}/mo
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
