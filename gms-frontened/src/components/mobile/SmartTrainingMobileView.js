import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconFitFlowLogo,
  IconBell,
  IconSteps,
  IconFlame,
  IconDroplet,
  IconQrCode,
  IconActivity,
  IconApple,
  IconPlay,
  IconCheck,
  IconMonitor,
  IconX,
  IconDumbbell
} from '../common/Icons';

export const SmartTrainingMobileView = () => {
  const {
    currentUser,
    members,
    routines,
    setViewMode,
    checkInMember,
    startWorkoutSession,
    activeWorkout,
    finishWorkoutSession
  } = useGym();

  const [mobileTab, setMobileTab] = useState('home');
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const member = members.find(m => m.id === currentUser.id || m.email === currentUser.email) || members[0];
  const todayRoutine = routines[0];

  const handleTurnstileTap = () => {
    const res = checkInMember(member.id, 'FitFlow Mobile QR Turnstile');
    showToast(res.message);
  };

  return (
    <div className="min-h-screen bg-[#ECEEFE] flex flex-col items-center justify-center p-2 sm:p-6 select-none font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 z-50 px-5 py-3 rounded-2xl bg-white border border-[#584CF4] text-[#584CF4] font-bold shadow-2xl flex items-center gap-2 animate-bounce text-xs">
          <IconCheck className="w-4 h-4 text-[#584CF4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Top Switcher */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setViewMode('desktop')}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#F5F7FD] border border-[#E5E9F7] text-[#111827] text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
        >
          <IconMonitor className="w-4 h-4 text-[#584CF4]" />
          <span>Return to FitFlow Admin Console (ERP)</span>
        </button>
      </div>

      {/* Smartphone Device Frame Viewport */}
      <div className="w-full max-w-[414px] h-[870px] bg-gradient-to-b from-[#F5F7FD] via-[#F8F9FE] to-[#EFF1FD] rounded-[48px] border-[8px] border-white shadow-[0_25px_70px_-15px_rgba(88,76,244,0.22)] overflow-hidden flex flex-col relative">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-[#E5E9F7] rounded-b-2xl z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mr-2" />
          <div className="w-10 h-1 bg-slate-300 rounded-full" />
        </div>

        {/* Top iOS Status Bar */}
        <div className="h-10 pt-2 px-7 flex items-center justify-between text-xs text-slate-800 font-semibold z-30">
          <span className="font-mono">9:41</span>
          <div className="flex items-center gap-2 text-slate-700">
            {/* Signal Bars */}
            <svg className="w-4 h-3 fill-current" viewBox="0 0 16 12">
              <rect x="0" y="8" width="2.5" height="4" rx="0.5"/>
              <rect x="4" y="5.5" width="2.5" height="6.5" rx="0.5"/>
              <rect x="8" y="3" width="2.5" height="9" rx="0.5"/>
              <rect x="12" y="0" width="2.5" height="12" rx="0.5"/>
            </svg>
            {/* Wifi Icon */}
            <svg className="w-3.5 h-3 fill-current" viewBox="0 0 16 12">
              <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4.24-3a6 6 0 0 1 8.48 0l-1.41 1.41a4 4 0 0 0-5.66 0L3.76 6.5zM1 3.5a10 10 0 0 1 14 0L13.6 4.9a8 8 0 0 0-11.2 0L1 3.5z"/>
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 border border-slate-700 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-slate-800 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Mobile App Header (FitFlow Logo + Notification Bell) */}
        <div className="px-6 pt-2 pb-2 flex items-center justify-between z-30">
          <div className="flex items-center gap-2">
            <IconFitFlowLogo className="w-8 h-8" />
            <span className="font-display font-black text-xl text-[#584CF4] tracking-tight">
              FitFlow
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => showToast("You're all caught up with today's workout!")}
              className="p-2 rounded-2xl bg-white border border-[#E5E9F7] text-slate-700 shadow-sm hover:text-[#584CF4]"
            >
              <IconBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#584CF4]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 pt-2 pb-24 space-y-4">
          {/* Hero Greeting & Athlete Graphic */}
          <div className="relative pt-2 pb-4 overflow-hidden">
            <div className="relative z-10 max-w-[210px]">
              <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight leading-[1.15] font-display">
                Good Morning,<br />
                Alex! 👋
              </h2>
              <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed font-medium">
                Every step today brings you closer to your best self.
              </p>
            </div>

            {/* Athlete Photo cutout in purple shirt holding shaker bottle */}
            <div className="absolute right-0 top-0 bottom-0 w-44 flex items-end justify-end pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80"
                alt="FitFlow Athlete"
                className="w-40 h-48 object-cover rounded-3xl shadow-[0_15px_30px_rgba(88,76,244,0.18)]"
              />
            </div>
          </div>

          {/* Daily Activity Card (Matches Screenshot Exactly) */}
          <div className="bg-white rounded-3xl p-5 border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#111827] font-display">
                Daily Activity
              </h3>
              <span className="text-xs font-mono text-[#64748B]">
                May 16, 2025
              </span>
            </div>

            {/* Body: Circular Ring on Left + Stat Badges on Right */}
            <div className="flex items-center gap-5">
              {/* Circular 75% Goal Ring */}
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="purpleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#584CF4" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  {/* Background Track Circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#EEF0FE"
                    strokeWidth="11"
                    fill="none"
                  />
                  {/* Progress Ring 75% */}
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="url(#purpleRingGrad)"
                    strokeWidth="11"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - 0.75)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Inner Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-[#111827] font-display leading-none">
                    75%
                  </span>
                  <span className="text-[11px] font-semibold text-[#64748B] mt-0.5">
                    Goal
                  </span>
                </div>
              </div>

              {/* Stat Rows on Right */}
              <div className="flex-1 space-y-3">
                {/* Steps Item */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#E8F8F0] flex items-center justify-center text-[#10B981] flex-shrink-0">
                    <IconSteps className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-[#64748B] font-medium">Steps</span>
                      <span className="font-bold text-[#111827]">
                        7,842 <span className="text-[#94A3B8] font-normal">/ 10,000</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Calories Item */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FEECEB] flex items-center justify-center text-[#EF4444] flex-shrink-0">
                    <IconFlame className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-[#64748B] font-medium">Calories</span>
                      <span className="font-bold text-[#111827]">
                        512 <span className="text-[#94A3B8] font-normal">/ 700 kcal</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Time Item */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#EEF0FE] flex items-center justify-center text-[#584CF4] flex-shrink-0">
                    <IconDroplet className="w-4 h-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-[#64748B] font-medium">Active Time</span>
                      <span className="font-bold text-[#111827]">
                        62 <span className="text-[#94A3B8] font-normal">/ 90 min</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Focus Card (Vibrant Royal Violet Gradient) */}
          <div className="rounded-3xl p-5 bg-gradient-to-r from-[#584CF4] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_12px_32px_rgba(88,76,244,0.35)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white backdrop-blur-md">
                TODAY'S FOCUS
              </span>
              <span className="text-xs font-mono opacity-80">{todayRoutine.durationMinutes} mins</span>
            </div>

            <h4 className="text-lg font-black font-display tracking-tight leading-snug">
              {todayRoutine.title}
            </h4>

            <p className="text-xs text-white/80 mt-1 leading-relaxed line-clamp-2">
              Chest hypertrophy with high-tension incline dumbbell pressing, lat pull-downs, and lateral raises.
            </p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
              <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                <IconFlame className="w-4 h-4 text-[#FDE047]" />
                ~{todayRoutine.caloriesEst} kcal burn
              </span>

              <button
                onClick={() => {
                  if (activeWorkout) {
                    finishWorkoutSession();
                    showToast('Workout finished!');
                  } else {
                    startWorkoutSession(todayRoutine);
                    showToast('Workout session started!');
                  }
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-[#584CF4] rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <IconPlay className="w-3.5 h-3.5 fill-current" />
                {activeWorkout ? 'Finish Set' : 'Start Focus'}
              </button>
            </div>
          </div>

          {/* Contactless Turnstile QR Card */}
          <div className="p-4 rounded-3xl bg-white border border-[#E5E9F7] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF0FE] flex items-center justify-center text-[#584CF4]">
                <IconQrCode className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#111827]">Contactless Turnstile Pass</h5>
                <span className="text-[10px] text-[#64748B] font-mono">{member.membershipId} • {member.plan}</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 bg-[#EEF0FE] hover:bg-[#E0E5F8] text-[#584CF4] rounded-xl text-xs font-bold"
            >
              Open Pass
            </button>
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E5E9F7] flex items-center justify-around px-3 z-30">
          <button
            onClick={() => setMobileTab('home')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              mobileTab === 'home' ? 'text-[#584CF4]' : 'text-[#94A3B8]'
            }`}
          >
            <IconActivity className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => setMobileTab('workout')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              mobileTab === 'workout' ? 'text-[#584CF4]' : 'text-[#94A3B8]'
            }`}
          >
            <IconDumbbell className="w-4 h-4" />
            Workout
          </button>

          {/* Center Pulsing QR Pass Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="w-12 h-12 -mt-6 rounded-2xl bg-gradient-to-r from-[#584CF4] to-[#7C3AED] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(88,76,244,0.4)] transform hover:scale-105 transition-transform"
            title="Scan Gym Pass"
          >
            <IconQrCode className="w-6 h-6" />
          </button>

          <button
            onClick={() => setMobileTab('nutrition')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
              mobileTab === 'nutrition' ? 'text-[#584CF4]' : 'text-[#94A3B8]'
            }`}
          >
            <IconApple className="w-4 h-4" />
            Diet
          </button>

          <button
            onClick={() => setViewMode('desktop')}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-[#94A3B8] hover:text-[#584CF4]"
            title="Switch to Desktop"
          >
            <IconMonitor className="w-4 h-4" />
            Console
          </button>
        </div>

        {/* Fullscreen Digital Pass Sheet */}
        {showQrModal && (
          <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm p-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/20">
              <span className="text-xs font-mono text-white font-bold">FITFLOW DIGITAL PASS</span>
              <button onClick={() => setShowQrModal(false)} className="p-1 text-white/70 hover:text-white">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl text-center shadow-2xl my-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF0FE] text-[#584CF4] flex items-center justify-center mx-auto mb-2 font-black font-display text-lg">
                <IconFitFlowLogo className="w-7 h-7" />
              </div>
              <h4 className="text-base font-black text-[#111827] font-display">{member.name}</h4>
              <div className="text-xs font-mono text-[#64748B] mb-4">{member.membershipId} • {member.plan}</div>

              {/* QR Code */}
              <div className="p-2 bg-white flex justify-center">
                <svg className="w-44 h-44" viewBox="0 0 100 100" fill="#111827">
                  <path d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zM40 10h10v20H40zm10 20h20v10H50zm-10 10h20v10H40zm30 10h10v10H70zm10 10h20v20H80zm-40 0h20v10H40zm10 20h20v10H50z" />
                </svg>
              </div>

              <div className="text-[10px] font-mono text-[#94A3B8] mt-2">
                Hold against turnstile optical sensor
              </div>
            </div>

            <button
              onClick={handleTurnstileTap}
              className="w-full py-3 bg-[#584CF4] text-white font-bold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2"
            >
              <IconCheck className="w-4 h-4" />
              Simulate Turnstile Entry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
