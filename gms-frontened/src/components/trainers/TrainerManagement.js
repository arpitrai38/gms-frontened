import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconUsers,
  IconCalendar,
  IconX,
  IconCheck
} from '../common/Icons';

export const TrainerManagement = () => {
  const { trainers, addTrainer, updateTrainer, deleteTrainer, members } = useGym();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedTrainerRoster, setSelectedTrainerRoster] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'Strength & Conditioning',
    experience: '5 Years',
    bio: '',
    schedule: 'Mon - Fri (7:00 AM - 3:00 PM)',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: 'Strength & Conditioning',
      experience: '5 Years',
      bio: '',
      schedule: 'Mon - Fri (7:00 AM - 3:00 PM)',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialty: trainer.specialty,
      experience: trainer.experience,
      bio: trainer.bio,
      schedule: trainer.schedule,
      avatar: trainer.avatar
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingTrainer) {
      updateTrainer(editingTrainer.id, formData);
      showToast(`Updated coach ${formData.name}`);
    } else {
      addTrainer(formData);
      showToast(`Added coach ${formData.name}`);
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
            Personal Trainers & Master Coaches
          </h2>
          <p className="text-xs text-[#64748B]">
            Coach certifications, client rosters, rating scores, and weekly floor schedules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
        >
          <IconPlus className="w-4 h-4" />
          Onboard Coach
        </button>
      </div>

      {/* Trainer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((t) => {
          const clientCount = members.filter(m => m.assignedTrainer === t.name).length;
          return (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-[#E5E9F7] p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(88,76,244,0.06)] hover:shadow-[0_14px_35px_rgba(88,76,244,0.1)] transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#EEF0FE] shadow-md group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-white border border-[#584CF4]/30 text-[10px] font-mono font-bold text-[#584CF4] shadow-sm">
                      ★ {t.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-2 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#64748B] hover:text-[#111827] transition-colors"
                      title="Edit Coach"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to remove ${t.name}?`)) {
                          deleteTrainer(t.id);
                          showToast(`Removed coach ${t.name}`);
                        }
                      }}
                      className="p-2 rounded-xl bg-[#FEECEB] hover:bg-[#EF4444] text-[#EF4444] hover:text-white transition-colors"
                      title="Delete Coach"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#584CF4] transition-colors">
                  {t.name}
                </h3>
                <div className="text-xs font-semibold text-[#584CF4] mt-0.5">{t.specialty}</div>
                <div className="text-[11px] font-mono text-[#64748B] mt-1">{t.experience} • {t.phone}</div>

                <p className="text-xs text-[#475569] mt-3 leading-relaxed line-clamp-2">
                  {t.bio}
                </p>

                <div className="mt-4 pt-4 border-t border-[#E5E9F7] grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#F5F7FD] p-2.5 rounded-2xl">
                    <div className="text-[10px] font-mono text-[#64748B] uppercase">Athletes</div>
                    <div className="font-bold text-[#111827] font-mono text-base mt-0.5">
                      {clientCount} Clients
                    </div>
                  </div>

                  <div className="bg-[#F5F7FD] p-2.5 rounded-2xl">
                    <div className="text-[10px] font-mono text-[#64748B] uppercase">Reviews</div>
                    <div className="font-bold text-[#584CF4] font-mono text-base mt-0.5">
                      {t.reviewsCount || 120}+
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-[#64748B] font-mono">
                  <IconCalendar className="w-3.5 h-3.5 text-[#584CF4]" />
                  <span>{t.schedule}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTrainerRoster(t)}
                className="mt-5 w-full py-2.5 bg-[#EEF0FE] hover:bg-[#584CF4] hover:text-white text-[#584CF4] rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <IconUsers className="w-4 h-4" />
                View Athlete Roster ({clientCount})
              </button>
            </div>
          );
        })}
      </div>

      {/* Trainer Client Roster Drawer */}
      {selectedTrainerRoster && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white border-l border-[#E5E9F7] h-full overflow-y-auto p-6 space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E9F7]">
              <div>
                <h3 className="text-base font-bold text-[#111827] font-display">Client Roster</h3>
                <p className="text-xs text-[#584CF4] font-mono font-bold">Coach: {selectedTrainerRoster.name}</p>
              </div>
              <button
                onClick={() => setSelectedTrainerRoster(null)}
                className="p-1 text-[#94A3B8] hover:text-[#111827] rounded-lg"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {members.filter(m => m.assignedTrainer === selectedTrainerRoster.name).length === 0 ? (
                <div className="text-center py-10 text-[#94A3B8] text-xs">
                  No athletes currently assigned to this coach.
                </div>
              ) : (
                members.filter(m => m.assignedTrainer === selectedTrainerRoster.name).map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white" />
                      <div>
                        <div className="text-xs font-bold text-[#111827]">{m.name}</div>
                        <div className="text-[10px] text-[#64748B] font-mono">{m.plan} • {m.membershipId}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F8F0] text-[#10B981] font-bold">
                      {m.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Trainer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#E5E9F7] rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
              <h3 className="text-lg font-bold text-[#111827] font-display">
                {editingTrainer ? 'Update Coach Profile' : 'Onboard New Fitness Coach'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-[#111827]">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Coach Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Chen"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="marcus@fitflow.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="HIIT & Calisthenics"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Schedule</label>
                  <input
                    type="text"
                    placeholder="Mon - Fri (6:00 AM - 2:00 PM)"
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Biography & Credentials</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4] resize-none"
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
