import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconQrCode,
  IconUserCheck,
  IconX,
  IconCheck
} from '../common/Icons';

export const MemberManagement = ({ isAddModalOpen, setIsAddModalOpen }) => {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    plans,
    trainers,
    checkInMember
  } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const [selectedMemberForDrawer, setSelectedMemberForDrawer] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'Gold Pro',
    assignedTrainer: 'Viktor Vance',
    emergencyContact: '',
    medicalNotes: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    expiryMonths: 12
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = selectedPlanFilter === 'ALL' || m.plan.toLowerCase().includes(selectedPlanFilter.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'ALL' || m.status === selectedStatusFilter;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      plan: 'Gold Pro',
      assignedTrainer: trainers[0]?.name || 'Viktor Vance',
      emergencyContact: '',
      medicalNotes: '',
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000000)}?w=150&auto=format&fit=crop&q=80`,
      expiryMonths: 12
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      plan: member.plan,
      assignedTrainer: member.assignedTrainer,
      emergencyContact: member.emergencyContact || '',
      medicalNotes: member.medicalNotes || '',
      avatar: member.avatar,
      expiryMonths: 12
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please enter member name and email');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, formData);
      showToast(`Updated member: ${formData.name}`);
    } else {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + Number(formData.expiryMonths));
      addMember({
        ...formData,
        expiryDate: expiry.toISOString().split('T')[0]
      });
      showToast(`Added athlete: ${formData.name}`);
    }

    setIsAddModalOpen(false);
    setEditingMember(null);
  };

  const handleQuickCheckin = (member) => {
    const res = checkInMember(member.id, 'Desk Quick Check-in');
    showToast(res.message);
  };

  const handleToggleFreeze = (member) => {
    const newStatus = member.status === 'Frozen' ? 'Active' : 'Frozen';
    updateMember(member.id, { status: newStatus });
    if (selectedMemberForDrawer) {
      setSelectedMemberForDrawer(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Member status: ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-white border border-[#584CF4] text-[#584CF4] font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <IconCheck className="w-5 h-5 text-[#584CF4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#111827] tracking-tight font-display">
            Member Directory & Roster
          </h2>
          <p className="text-xs text-[#64748B]">
            Manage athlete accounts, membership tiers, health restrictions, and digital turnstile passes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
        >
          <IconPlus className="w-4 h-4" />
          Register Member
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5E9F7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#584CF4] transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-[#F5F7FD] border border-[#E5E9F7] text-xs text-[#111827] font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#584CF4]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Frozen">Frozen</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={selectedPlanFilter}
            onChange={(e) => setSelectedPlanFilter(e.target.value)}
            className="bg-[#F5F7FD] border border-[#E5E9F7] text-xs text-[#111827] font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#584CF4]"
          >
            <option value="ALL">All Plans</option>
            {plans.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border border-[#E5E9F7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FD] border-b border-[#E5E9F7] text-[#64748B] font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Athlete / ID</th>
                <th className="py-3.5 px-4">Membership Plan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Assigned Coach</th>
                <th className="py-3.5 px-4">Check-ins</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F7] text-[#334155]">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#94A3B8]">
                    No members found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-[#F8FAFF] transition-colors group cursor-pointer"
                    onClick={() => setSelectedMemberForDrawer(m)}
                  >
                    {/* Athlete & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#EEF0FE]"
                        />
                        <div>
                          <div className="font-bold text-[#111827] text-sm group-hover:text-[#584CF4] transition-colors">
                            {m.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#64748B]">{m.membershipId} • {m.phone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#111827]">{m.plan}</span>
                      {m.balanceDue > 0 && (
                        <div className="text-[10px] text-[#EF4444] font-bold mt-0.5">
                          Due: ${m.balanceDue}
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono inline-block ${
                        m.status === 'Active'
                          ? 'bg-[#E8F8F0] text-[#10B981]'
                          : m.status === 'Frozen'
                          ? 'bg-[#EEF0FE] text-[#584CF4]'
                          : 'bg-[#FEECEB] text-[#EF4444]'
                      }`}>
                        {m.status}
                      </span>
                    </td>

                    {/* Assigned Trainer */}
                    <td className="py-3.5 px-4 text-[#475569]">
                      {m.assignedTrainer}
                    </td>

                    {/* Check-ins */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#111827]">
                      {m.attendanceCount} sessions
                    </td>

                    {/* Expiry */}
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {m.expiryDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleQuickCheckin(m)}
                          className="p-1.5 rounded-xl bg-[#EEF0FE] hover:bg-[#584CF4] hover:text-white text-[#584CF4] transition-colors"
                          title="Quick Check-in to Gym"
                        >
                          <IconUserCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#475569] hover:text-[#111827] transition-colors"
                          title="Edit Member"
                        >
                          <IconEdit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove member ${m.name}?`)) {
                              deleteMember(m.id);
                              showToast(`Removed member ${m.name}`);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-[#FEECEB] hover:bg-[#EF4444] text-[#EF4444] hover:text-white transition-colors"
                          title="Delete Member"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Details Drawer Modal */}
      {selectedMemberForDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-white border-l border-[#E5E9F7] h-full overflow-y-auto p-6 space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F7]">
              <span className="text-xs font-mono text-[#584CF4] uppercase tracking-widest font-bold">Athlete Dossier</span>
              <button
                onClick={() => setSelectedMemberForDrawer(null)}
                className="p-1 text-[#94A3B8] hover:text-[#111827] rounded-lg"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Hero Card */}
            <div className="text-center p-6 rounded-3xl bg-[#F5F7FD] border border-[#E5E9F7]">
              <img
                src={selectedMemberForDrawer.avatar}
                alt={selectedMemberForDrawer.name}
                className="w-24 h-24 rounded-3xl object-cover mx-auto ring-4 ring-white shadow-lg mb-4"
              />
              <h3 className="text-xl font-black text-[#111827] font-display">{selectedMemberForDrawer.name}</h3>
              <p className="text-xs text-[#64748B] font-mono mt-0.5">{selectedMemberForDrawer.membershipId}</p>
              
              <div className="flex justify-center gap-2 mt-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#EEF0FE] text-[#584CF4]">
                  {selectedMemberForDrawer.plan}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-white text-[#475569] border border-[#E5E9F7]">
                  {selectedMemberForDrawer.status}
                </span>
              </div>
            </div>

            {/* Turnstile QR Pass Card */}
            <div className="p-5 rounded-3xl bg-[#F5F7FD] border border-[#E5E9F7] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                  <IconQrCode className="w-4 h-4 text-[#584CF4]" /> Digital Turnstile Pass
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">Tap to simulate scan</span>
              </div>

              <div
                onClick={() => handleQuickCheckin(selectedMemberForDrawer)}
                className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow border border-[#E5E9F7]"
              >
                <svg className="w-36 h-36" viewBox="0 0 100 100" fill="#111827">
                  <path d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zM40 10h10v20H40zm10 20h20v10H50zm-10 10h20v10H40zm30 10h10v10H70zm10 10h20v20H80zm-40 0h20v10H40zm10 20h20v10H50z" />
                </svg>
                <div className="text-[10px] font-mono text-[#111827] font-bold mt-2 tracking-wider">
                  {selectedMemberForDrawer.membershipId}
                </div>
              </div>
            </div>

            {/* Health & Medical Alert */}
            <div className="p-4 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7] space-y-1.5">
              <div className="text-xs font-mono text-[#EF4444] font-bold uppercase">Medical & Health Notes</div>
              <p className="text-xs text-[#475569] leading-relaxed">
                {selectedMemberForDrawer.medicalNotes || 'No specific restrictions or injuries logged.'}
              </p>
            </div>

            {/* Quick Action Drawer Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleQuickCheckin(selectedMemberForDrawer)}
                className="w-full py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(88,76,244,0.3)] transition-all"
              >
                <IconUserCheck className="w-4 h-4" />
                Check In / Out Now
              </button>

              <button
                onClick={() => handleToggleFreeze(selectedMemberForDrawer)}
                className="w-full py-2.5 bg-white hover:bg-[#F5F7FD] text-[#475569] font-semibold rounded-2xl text-xs border border-[#E5E9F7] transition-colors"
              >
                {selectedMemberForDrawer.status === 'Frozen' ? 'Unfreeze Membership' : 'Freeze Membership Pass'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#E5E9F7] rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
              <h3 className="text-lg font-bold text-[#111827] font-display">
                {editingMember ? 'Edit Athlete Record' : 'Register New Club Member'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#94A3B8] hover:text-[#111827]">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elena Rostova"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="elena@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Plan</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.name}>{p.name} (${p.price}/{p.billingPeriod})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Emergency Contact</label>
                <input
                  type="text"
                  placeholder="Name & phone number"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E9F7]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#475569] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold shadow-md"
                >
                  {editingMember ? 'Save Changes' : 'Register Athlete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
