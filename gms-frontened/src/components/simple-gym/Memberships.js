import React, { useState, useEffect } from 'react';
import { membershipsAPI } from '../../services/api';

export const Memberships = () => {
  const [plans, setPlans] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [months, setMonths] = useState(1);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await membershipsAPI.getAll();
    setLoading(false);
    if (res.success) {
      setPlans(res.data);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const res = await membershipsAPI.create({
      title,
      months: Number(months),
      price: Number(price),
      description
    });
    if (res.success) {
      setIsAddModalOpen(false);
      setTitle('');
      setPrice('');
      setDescription('');
      fetchPlans();
    }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">Gym Membership Packages</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">Manage billing duration and fee structures for members</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-sm shadow-cyan-500/20 transition-all flex items-center space-x-1 shrink-0 self-start sm:self-auto"
        >
          <span>+ Add Package</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-xs">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 hover:border-cyan-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">💳</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                    {p.months} Month{p.months > 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                <p className="text-xs text-slate-500 mt-2">{p.description || 'Full gym floor & cardio access'}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Package Fee:</span>
                <span className="text-2xl font-black text-cyan-700">₹{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Plan Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Create Membership Package</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2 Months Special Plan"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1800"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Perks</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is included in this package..."
                  rows="3"
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-md shadow-cyan-500/20 transition-all mt-2"
              >
                Save Package →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
