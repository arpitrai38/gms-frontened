import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconBell,
  IconCheck
} from '../common/Icons';

export const NotificationsCenter = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, sendBroadcast } = useGym();

  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return;

    sendBroadcast(broadcastTitle, broadcastMsg);
    showToast('Broadcast dispatched across club screens & mobile apps!');
    setBroadcastTitle('');
    setBroadcastMsg('');
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
            Notifications Center & Club Broadcasts
          </h2>
          <p className="text-xs text-[#64748B]">
            Automated system alerts, contract expiry warnings, payment fail notices, and gym-wide push broadcasts.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2 bg-white hover:bg-[#F5F7FD] text-[#475569] hover:text-[#111827] border border-[#E5E9F7] rounded-2xl text-xs font-semibold shadow-sm transition-all"
        >
          Mark All Read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notification Stream */}
        <div className="lg:col-span-2 space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white p-12 text-center text-[#94A3B8] rounded-3xl border border-[#E5E9F7] shadow-sm">
              All caught up! No active notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer bg-white ${
                  n.unread
                    ? 'border-[#584CF4] shadow-[0_10px_30px_rgba(88,76,244,0.08)] ring-1 ring-[#EEF0FE]'
                    : 'border-[#E5E9F7] shadow-sm hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      n.type === 'warning'
                        ? 'bg-[#FFFBEB] text-[#F59E0B]'
                        : n.type === 'error'
                        ? 'bg-[#FEECEB] text-[#EF4444]'
                        : n.type === 'success'
                        ? 'bg-[#E8F8F0] text-[#10B981]'
                        : 'bg-[#EEF0FE] text-[#584CF4]'
                    }`}>
                      <IconBell className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111827]">{n.title}</h4>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#584CF4] inline-block" />
                        )}
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#94A3B8] whitespace-nowrap flex-shrink-0">
                    {n.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right 1 Col: Club Broadcast Composer */}
        <div>
          <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-sm sticky top-24">
            <h3 className="text-base font-bold text-[#111827] mb-1 flex items-center gap-2">
              <span className="text-[#584CF4]">📢</span> Send Club Broadcast
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Push an announcement to all athlete mobile apps and front desk terminals.
            </p>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sauna Maintenance Notice"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Details for all gym athletes and coaching staff..."
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
              >
                Dispatch Broadcast
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
