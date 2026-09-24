import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconPlus,
  IconEdit,
  IconCheck,
  IconX,
  IconUsers
} from '../common/Icons';

export const MembershipPlans = () => {
  const { plans, addPlan, updatePlan, members } = useGym();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 99,
    billingPeriod: 'Monthly',
    color: '#584CF4',
    popular: false,
    featuresText: '24/7 Gym floor access\nFree locker access\n1 Personal training session'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: 99,
      billingPeriod: 'Monthly',
      color: '#584CF4',
      popular: false,
      featuresText: '24/7 Gym access\nAll cardio & strength zones\nLocker & shower facilities'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      billingPeriod: plan.billingPeriod,
      color: plan.color || '#584CF4',
      popular: plan.popular || false,
      featuresText: plan.features.join('\n')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const featureList = formData.featuresText
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const planPayload = {
      name: formData.name,
      price: Number(formData.price),
      billingPeriod: formData.billingPeriod,
      color: formData.color,
      popular: formData.popular,
      features: featureList
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, planPayload);
      showToast(`Updated plan: ${formData.name}`);
    } else {
      addPlan(planPayload);
      showToast(`Created plan: ${formData.name}`);
    }

    setIsModalOpen(false);
  };

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
            Membership Tiers & Subscriptions
          </h2>
          <p className="text-xs text-[#64748B]">
            Configure recurring membership tiers, guest privileges, and facility passes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
        >
          <IconPlus className="w-4 h-4" />
          Create New Tier
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => {
          const subscriberCount = members.filter(m => m.plan.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])).length || p.activeMembers || 0;
          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-white ${
                p.popular
                  ? 'border-2 border-[#584CF4] shadow-[0_15px_40px_rgba(88,76,244,0.14)] ring-2 ring-[#EEF0FE]'
                  : 'border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.05)] hover:shadow-lg'
              }`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 bg-[#584CF4] text-white text-[10px] font-black font-mono uppercase px-4 py-1 rounded-bl-2xl shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#584CF4]" />
                    <h3 className="text-lg font-bold text-[#111827] font-display">{p.name}</h3>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-1.5 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#64748B] hover:text-[#111827]"
                    title="Edit Plan"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-black text-[#111827] font-display">${p.price}</span>
                  <span className="text-xs font-mono text-[#64748B] uppercase">/{p.billingPeriod}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7] mb-6 text-xs">
                  <IconUsers className="w-4 h-4 text-[#584CF4]" />
                  <span className="text-[#475569] font-mono">
                    <strong className="text-[#111827]">{subscriberCount}</strong> Active Athletes
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">Privileges</div>
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#334155]">
                      <IconCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#E5E9F7]">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    p.popular
                      ? 'bg-[#584CF4] hover:bg-[#483BE0] text-white shadow-md'
                      : 'bg-[#F5F7FD] hover:bg-[#EEF0FE] text-[#584CF4] border border-[#E5E9F7]'
                  }`}
                >
                  Configure Terms
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E9F7] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
              <h3 className="text-base font-bold text-[#111827] font-display">
                {editingPlan ? 'Edit Membership Plan' : 'Add Membership Plan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-[#111827]">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Tier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diamond Unlimited"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Price ($)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Billing Period</label>
                  <select
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                    <option value="Single Day">Single Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Features (One per line)</label>
                <textarea
                  rows={4}
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4] font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E9F7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#475569] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold shadow-md"
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
