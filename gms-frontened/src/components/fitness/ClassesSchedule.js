import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconCheck
} from '../common/Icons';

export const ClassesSchedule = () => {
  const { classes, toggleBookClass } = useGym();

  const [selectedDay, setSelectedDay] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleBooking = (cls) => {
    toggleBookClass(cls.id);
    showToast(cls.isBookedByUser ? `Cancelled seat in ${cls.name}` : `Reserved spot in ${cls.name}!`);
  };

  const days = ['ALL', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredClasses = classes.filter((c) => {
    if (selectedDay === 'ALL') return true;
    return c.day.toLowerCase() === selectedDay.toLowerCase();
  });

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
            Weekly Group Classes & Timetable
          </h2>
          <p className="text-xs text-[#64748B]">
            Instructor-led athletic conditioning, rhythm cycle, and yoga flows with instant booking.
          </p>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-[#584CF4] text-white shadow-md'
                  : 'bg-white text-[#64748B] hover:text-[#111827] border border-[#E5E9F7]'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const isFull = cls.bookedCount >= cls.capacity;
          return (
            <div
              key={cls.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all group ${
                cls.isBookedByUser
                  ? 'border-2 border-[#584CF4] shadow-[0_12px_32px_rgba(88,76,244,0.12)] ring-2 ring-[#EEF0FE]'
                  : 'border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.05)] hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F5F7FD] text-[#475569] border border-[#E5E9F7]">
                    {cls.day} • {cls.time}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    cls.intensity === 'Extreme'
                      ? 'bg-[#FEECEB] text-[#EF4444]'
                      : cls.intensity === 'High'
                      ? 'bg-[#FFFBEB] text-[#F59E0B]'
                      : 'bg-[#EEF0FE] text-[#584CF4]'
                  }`}>
                    {cls.intensity}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#111827] font-display mt-2 group-hover:text-[#584CF4] transition-colors">
                  {cls.name}
                </h3>
                <div className="text-xs text-[#64748B] font-mono mt-0.5">{cls.room}</div>

                <p className="text-xs text-[#475569] mt-3 leading-relaxed">
                  {cls.description}
                </p>

                {/* Coach & Capacity */}
                <div className="mt-5 pt-4 border-t border-[#E5E9F7] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={cls.instructorAvatar}
                      alt={cls.instructor}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#EEF0FE]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#111827]">{cls.instructor}</div>
                      <div className="text-[10px] text-[#64748B] font-mono">Lead Coach</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-[#111827]">
                      {cls.bookedCount} / {cls.capacity}
                    </div>
                    <div className="text-[10px] text-[#64748B]">
                      {isFull ? <span className="text-[#EF4444] font-bold">Class Full</span> : `${cls.capacity - cls.bookedCount} seats left`}
                    </div>
                  </div>
                </div>

                {/* Capacity Progress bar */}
                <div className="w-full bg-[#F5F7FD] rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-[#EF4444]' : 'bg-[#584CF4]'
                    }`}
                    style={{ width: `${Math.min(100, (cls.bookedCount / cls.capacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleBooking(cls)}
                  disabled={isFull && !cls.isBookedByUser}
                  className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    cls.isBookedByUser
                      ? 'bg-[#584CF4] text-white shadow-md hover:bg-[#483BE0]'
                      : isFull
                      ? 'bg-[#F5F7FD] text-[#94A3B8] cursor-not-allowed border border-[#E5E9F7]'
                      : 'bg-[#EEF0FE] hover:bg-[#584CF4] hover:text-white text-[#584CF4] transition-colors'
                  }`}
                >
                  {cls.isBookedByUser ? (
                    <>
                      <IconCheck className="w-4 h-4" />
                      Spot Reserved (Cancel)
                    </>
                  ) : isFull ? (
                    'Waitlist Only (Full)'
                  ) : (
                    'Reserve Athlete Seat'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
