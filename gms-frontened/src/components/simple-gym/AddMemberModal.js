import React, { useState, useEffect } from 'react';
import { membersAPI, membershipsAPI } from '../../services/api';
import { PhotoAvatarSelector } from '../common/PhotoAvatarSelector';

export const AddMemberModal = ({ isOpen, onClose, onMemberAdded }) => {
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [membershipMonths, setMembershipMonths] = useState(1);
  const [amountPaid, setAmountPaid] = useState(1000);
  const [nextBillDate, setNextBillDate] = useState('');
  const [profilePic, setProfilePic] = useState(''); // Not auto-selected, starts empty

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch plans on open
  useEffect(() => {
    if (isOpen) {
      membershipsAPI.getAll().then((res) => {
        if (res.success && res.data.length > 0) {
          setPlans(res.data);
          const first = res.data[0];
          setSelectedPlan(first.title);
          setMembershipMonths(first.months);
          setAmountPaid(first.price);
        }
      });
      // Reset form states
      setName('');
      setMobileNo('');
      setAddress('');
      setGender('Male');
      setProfilePic('');
      setErrorMsg('');
    }
  }, [isOpen]);

  // Compute Next Bill Date whenever joiningDate or membershipMonths changes
  useEffect(() => {
    if (joiningDate) {
      const d = new Date(joiningDate);
      d.setMonth(d.getMonth() + Number(membershipMonths || 1));
      setNextBillDate(d.toISOString().split('T')[0]);
    }
  }, [joiningDate, membershipMonths]);

  if (!isOpen) return null;

  const handlePlanChange = (e) => {
    const title = e.target.value;
    setSelectedPlan(title);
    const found = plans.find((p) => p.title === title);
    if (found) {
      setMembershipMonths(found.months);
      setAmountPaid(found.price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await membersAPI.create({
      name,
      mobileNo,
      address,
      gender,
      joiningDate,
      membershipPlan: selectedPlan,
      membershipMonths,
      amountPaid,
      profilePic // user's chosen photo or avatar, or empty if none selected
    });

    setLoading(false);
    if (res.success) {
      onMemberAdded(res.data);
      onClose();
    } else {
      setErrorMsg(res.message || 'Failed to add member.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black text-xl">
              +
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Register New Member</h3>
              <p className="text-xs text-slate-500">Fill in details to onboard member & record fee</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Member Photo / Avatar (Optional & Manual Selection) */}
          <PhotoAvatarSelector
            label="Member Photo (Optional - Upload or Choose Avatar)"
            value={profilePic}
            onChange={(pic) => setProfilePic(pic)}
          />

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Member Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rohan Mehra"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Sector 14, Gurugram"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                required
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Membership Plan *</label>
              <select
                value={selectedPlan}
                onChange={handlePlanChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                {plans.length === 0 ? (
                  <option value="">No plans found. Add plans in Membership tab.</option>
                ) : (
                  plans.map((p) => (
                    <option key={p.title} value={p.title}>
                      {p.title} — ₹{p.price} ({p.months} mo)
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                required
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Next Bill / Expiry Date</label>
              <input
                type="text"
                readOnly
                value={nextBillDate}
                className="w-full px-3.5 py-2.5 bg-cyan-50/70 border border-cyan-200 rounded-xl text-cyan-800 font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-60"
            >
              {loading ? 'Adding Member...' : 'Confirm & Add Member to Gym →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
