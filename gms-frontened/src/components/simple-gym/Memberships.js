import React, { useState, useEffect, useCallback } from 'react';
import { membershipsAPI } from '../../services/api';

const DURATION_PRESETS = [
  { label: '1 Month', months: 1 },
  { label: '3 Months (Quarterly)', months: 3 },
  { label: '6 Months (Half-Yearly)', months: 6 },
  { label: '1 Year (Annual VIP)', months: 12 }
];

const TEMPLATE_PLANS = [
  {
    title: '1 Month Standard',
    months: 1,
    price: 1000,
    description: 'Full gym floor access, cardio equipment & locker facility'
  },
  {
    title: '3 Months Fitness Pro',
    months: 3,
    price: 2500,
    description: 'Quarterly training with personal trainer fitness consultation & locker access'
  },
  {
    title: '6 Months Transformation',
    months: 6,
    price: 4500,
    description: 'Half-yearly pass with custom workout splits, body assessment & diet guidance'
  },
  {
    title: '12 Months Annual VIP',
    months: 12,
    price: 8000,
    description: 'All-inclusive annual VIP access with 2 free guest passes per month & nutrition tracking'
  }
];

export const Memberships = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Form inputs
  const [title, setTitle] = useState('');
  const [months, setMonths] = useState(1);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const res = await membershipsAPI.getAll();
    setLoading(false);
    if (res.success && Array.isArray(res.data)) {
      setPlans(res.data);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open Add Modal
  const handleOpenAddModal = (preset = null) => {
    if (preset) {
      setTitle(preset.title || '');
      setMonths(preset.months || 1);
      setPrice(preset.price !== undefined ? String(preset.price) : '');
      setDescription(preset.description || '');
    } else {
      setTitle('');
      setMonths(1);
      setPrice('');
      setDescription('');
    }
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setTitle(plan.title || '');
    setMonths(plan.months || 1);
    setPrice(plan.price !== undefined ? String(plan.price) : '');
    setDescription(plan.description || '');
    setFormError('');
  };

  // Create or Update Plan
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || title.trim().length < 2) {
      setFormError('Plan title must be at least 2 characters long.');
      return;
    }

    const numMonths = Number(months);
    const numPrice = Number(price);

    if (isNaN(numMonths) || numMonths <= 0) {
      setFormError('Duration must be at least 1 month.');
      return;
    }

    if (isNaN(numPrice) || numPrice < 0) {
      setFormError('Price cannot be negative.');
      return;
    }

    setIsSubmitting(true);

    if (editingPlan) {
      // Update
      const planId = editingPlan._id || editingPlan.id;
      const res = await membershipsAPI.update(planId, {
        title: title.trim(),
        months: numMonths,
        price: numPrice,
        description: description.trim()
      });
      setIsSubmitting(false);

      if (res.success) {
        showToast('Membership plan updated successfully!');
        setEditingPlan(null);
        fetchPlans();
      } else {
        setFormError(res.message || 'Failed to update membership plan.');
      }
    } else {
      // Create
      const res = await membershipsAPI.create({
        title: title.trim(),
        months: numMonths,
        price: numPrice,
        description: description.trim()
      });
      setIsSubmitting(false);

      if (res.success) {
        showToast('New membership plan created successfully!');
        setIsAddModalOpen(false);
        fetchPlans();
      } else {
        setFormError(res.message || 'Failed to create membership plan.');
      }
    }
  };

  // Delete Plan
  const handleDeletePlan = async (id, planTitle) => {
    if (!window.confirm(`Are you sure you want to remove the plan "${planTitle}"?`)) return;
    setDeletingId(id);
    const res = await membershipsAPI.delete(id);
    setDeletingId(null);
    if (res.success) {
      showToast(`Plan "${planTitle}" removed.`);
      setPlans((prev) => prev.filter((p) => (p._id !== id && p.id !== id)));
    } else {
      alert(res.message || 'Failed to delete plan.');
    }
  };

  const filteredPlans = plans.filter((p) => {
    const s = search.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(s)) ||
      (p.description && p.description.toLowerCase().includes(s))
    );
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 bg-teal-600 text-white font-bold text-xs rounded-2xl shadow-xl border border-teal-400 flex items-center space-x-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Gym Membership Packages & Plans</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
              {plans.length} Available
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Configure subscription durations, pricing, and member perks for your gym
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="flex-1 sm:w-56 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500"
          />

          <button
            onClick={() => handleOpenAddModal()}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-sm shadow-cyan-500/25 transition-all flex items-center space-x-1 shrink-0 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <span>+</span>
            <span>Add Plan</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Starter Plan Presets */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-50/60 via-teal-50/40 to-sky-50/50 border border-cyan-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">⚡</span>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Quick Template Shortcuts</h4>
            <p className="text-[11px] text-slate-500">Click any preset to prefill and add a plan instantly</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {TEMPLATE_PLANS.map((tpl) => (
            <button
              key={tpl.title}
              onClick={() => handleOpenAddModal(tpl)}
              className="px-2.5 py-1 rounded-xl bg-white border border-cyan-200 text-cyan-800 hover:bg-cyan-500 hover:text-white text-[11px] font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
            >
              <span>+</span>
              <span>{tpl.title} (₹{tpl.price})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          Loading membership plans...
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl font-bold">
            💳
          </div>
          <h3 className="text-base font-black text-slate-900">No Membership Plans Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create membership packages and subscription tiers with custom duration and pricing for your gym members.
          </p>
          <button
            onClick={() => handleOpenAddModal()}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-sm shadow-cyan-500/20 cursor-pointer"
          >
            + Add Your First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPlans.map((plan) => {
            const monthlyEquivalent = plan.months > 1 ? Math.round(plan.price / plan.months) : plan.price;

            return (
              <div
                key={plan._id || plan.id}
                className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-cyan-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar: Icon, Months & Actions */}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-50 to-teal-50 border border-cyan-200 flex items-center justify-center text-xl shadow-xs">
                      💳
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModal(plan)}
                        className="p-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                        title="Edit Plan"
                      >
                        <span>✏️</span>
                        <span className="text-[11px] hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id || plan.id, plan.title)}
                        disabled={deletingId === (plan._id || plan.id)}
                        className="w-7 h-7 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors text-xs cursor-pointer"
                        title="Delete Plan"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="mt-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase tracking-wider">
                      {plan.months} Month{plan.months > 1 ? 's' : ''} Validity
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-2">{plan.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                      {plan.description || 'Full gym floor access & equipment facilities'}
                    </p>
                  </div>
                </div>

                {/* Pricing & Monthly Breakdown */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold">Total Fee:</span>
                    <span className="text-2xl font-black text-cyan-800 font-mono">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {plan.months > 1 && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                      <span>Monthly Equivalent:</span>
                      <span className="font-semibold text-teal-600">
                        ≈ ₹{monthlyEquivalent.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Membership Plan Modal */}
      {(isAddModalOpen || Boolean(editingPlan)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white border border-cyan-100 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl text-slate-800 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 mr-2">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl shrink-0 border border-cyan-200">
                  {editingPlan ? '✏️' : '💳'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {editingPlan ? 'Edit Membership Plan' : 'Create Membership Plan'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                    {editingPlan
                      ? 'Update pricing, billing duration, or included perks'
                      : 'Set up a new subscription package for gym members'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingPlan(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors text-xs shrink-0 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmitForm} className="mt-4 space-y-4 text-xs">
              {/* Plan Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Plan Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 3 Months Fitness Pro, Gold VIP Annual"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 text-xs"
                />
              </div>

              {/* Duration Presets + Custom Input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Billing Duration <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
                  {DURATION_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.months}
                      onClick={() => setMonths(p.months)}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                        Number(months) === p.months
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-cyan-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-slate-500 text-[11px]">Custom months:</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={months}
                    onChange={(e) => setMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-cyan-500 focus:bg-white text-xs"
                  />
                  <span className="text-slate-500 text-[11px]">Month(s) validity</span>
                </div>
              </div>

              {/* Package Fee / Price */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Package Fee (₹ INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 text-xs"
                  />
                </div>
                {price && Number(months) > 1 && (
                  <p className="text-[11px] text-teal-600 mt-1 font-semibold">
                    ≈ ₹{Math.round(Number(price) / Number(months)).toLocaleString('en-IN')}/month
                  </p>
                )}
              </div>

              {/* Included Perks / Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Included Perks & Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Full floor access, cardio equipment, locker facility, 1 free consultation..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 text-xs leading-relaxed"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingPlan(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : editingPlan
                    ? 'Save Changes'
                    : 'Create Plan →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
