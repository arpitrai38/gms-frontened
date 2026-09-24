import React, { useState, useEffect } from 'react';
import { membersAPI, membershipsAPI } from '../../services/api';

export const RenewModal = ({ isOpen, member, onClose, onRenewed }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [months, setMonths] = useState(1);
  const [amountPaid, setAmountPaid] = useState(1000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && member) {
      membershipsAPI.getAll().then((res) => {
        if (res.success && res.data.length > 0) {
          setPlans(res.data);
          const match = res.data.find((p) => p.title === member.membershipPlan) || res.data[0];
          setSelectedPlan(match.title);
          setMonths(match.months);
          setAmountPaid(match.price);
        }
      });
    }
  }, [isOpen, member]);

  if (!isOpen || !member) return null;

  const handlePlanChange = (e) => {
    const title = e.target.value;
    setSelectedPlan(title);
    const found = plans.find((p) => p.title === title);
    if (found) {
      setMonths(found.months);
      setAmountPaid(found.price);
    }
  };

  const handleRenew = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await membersAPI.renew(member._id || member.id, {
      membershipPlan: selectedPlan,
      membershipMonths: months,
      amountPaid
    });

    setLoading(false);
    if (res.success) {
      onRenewed(res.data);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">Renew Membership</h3>
            <p className="text-xs text-cyan-600 font-semibold">Member: {member.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleRenew} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Renewal Package</label>
            <select
              value={selectedPlan}
              onChange={handlePlanChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              {plans.map((p) => (
                <option key={p.title} value={p.title}>
                  {p.title} — ₹{p.price} ({p.months} mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Renewal Fee (₹)</label>
            <input
              type="number"
              required
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-cyan-50/60 border border-cyan-100 text-slate-600">
            <span className="block text-[11px] font-bold text-cyan-800">Renewal Effect:</span>
            Next expiration date will be extended by {months} month(s) starting from today, and status will be set to Active.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-60"
          >
            {loading ? 'Renewing...' : 'Confirm Renewal & Activate →'}
          </button>
        </form>
      </div>
    </div>
  );
};
