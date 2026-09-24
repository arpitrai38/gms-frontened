import React, { useState, useEffect, useCallback } from 'react';
import { trainersAPI } from '../../services/api';
import { AddTrainerModal } from './AddTrainerModal';

export const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTrainers = useCallback(async () => {
    setLoading(true);
    const res = await trainersAPI.getAll();
    setLoading(false);
    if (res.success && Array.isArray(res.data)) {
      setTrainers(res.data);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove trainer "${name}"?`)) return;
    setDeletingId(id);
    const res = await trainersAPI.delete(id);
    setDeletingId(null);
    if (res.success) {
      setTrainers((prev) => prev.filter((t) => t._id !== id));
    } else {
      alert(res.message || 'Failed to delete trainer.');
    }
  };

  const filteredTrainers = trainers.filter((t) => {
    const s = search.toLowerCase();
    return (
      (t.userName && t.userName.toLowerCase().includes(s)) ||
      (t.email && t.email.toLowerCase().includes(s)) ||
      (t.specialty && t.specialty.toLowerCase().includes(s)) ||
      (t.phone && t.phone.includes(s))
    );
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Gym Coaches & Trainers</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
              {trainers.length} Registered
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Manage fitness trainers, client specialties, and coach credentials
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainer..."
            className="flex-1 sm:w-56 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500"
          />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-bold text-xs shadow-sm shadow-cyan-500/25 transition-all flex items-center space-x-1 shrink-0 whitespace-nowrap"
          >
            <span>+</span>
            <span className="hidden sm:inline"> Add Trainer</span>
            <span className="sm:hidden"> Trainer</span>
          </button>
        </div>
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          Loading gym trainers...
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl font-bold">
            🏋️‍♂️
          </div>
          <h3 className="text-base font-black text-slate-900">No Trainers Registered Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add fitness coaches and trainers to your gym. Their first-time login password will automatically be their name!
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs shadow-sm shadow-cyan-500/20"
          >
            + Add Your First Trainer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrainers.map((trainer) => {
            const initials = trainer.userName
              ? trainer.userName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'T';

            return (
              <div
                key={trainer._id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top: Avatar & Delete */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      {trainer.profilePic ? (
                        <img
                          src={trainer.profilePic}
                          alt={trainer.userName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-300 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-xs border border-cyan-200">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{trainer.userName}</h4>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                          {trainer.specialty || 'Fitness Trainer'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(trainer._id, trainer.userName)}
                      disabled={deletingId === trainer._id}
                      className="w-8 h-8 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors text-xs"
                      title="Remove Trainer"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-semibold text-slate-800 font-mono text-[11px]">{trainer.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-medium text-slate-800">{trainer.phone || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Password / Access Pill */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Initial Password:</span>
                  <span className="font-bold text-cyan-800 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {trainer.userName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Trainer Modal */}
      <AddTrainerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTrainerAdded={(newTrainer) => {
          setTrainers((prev) => [newTrainer, ...prev]);
        }}
      />
    </div>
  );
};
