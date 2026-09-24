import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { progressAPI } from '../../services/api';

export const TraineeDashboard = () => {
  const {
    currentUser,
    routines,
    diet,
    logWater,
    classes,
    toggleBookClass,
    attendanceLogs,
    checkInMember,
    payments,
    openInvoice,
    logout
  } = useGym();

  const [activeTab, setActiveTab] = useState('workout'); // 'workout' | 'nutrition' | 'attendance' | 'invoices' | 'classes' | 'progress'
  const [completedSets, setCompletedSets] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [checkInNotice, setCheckInNotice] = useState('');

  // Body Progress Form
  const [logWeight, setLogWeight] = useState(76.5);
  const [logBodyFat, setLogBodyFat] = useState(15.5);
  const [progressMsg, setProgressMsg] = useState('');

  // Active workout
  const currentWorkout = routines && routines.length > 0 ? routines[0] : null;

  // Trainee profile data
  const memberProfile = currentUser?.memberProfile || {
    membershipId: 'APX-1001',
    plan: 'Gold Pro Athlete',
    expiryDate: '2026-12-31',
    qrCode: 'APX-MEMBER-1001-ALEX-RIVERA'
  };

  // Rest Timer Countdown
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  const startRestTimer = (seconds = 60) => {
    setTimerSeconds(seconds);
    setIsTimerActive(true);
  };

  const toggleSetDone = (exId, setIdx) => {
    const key = `${exId}_set_${setIdx}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle Gym Check-in punch
  const handleGymCheckIn = async () => {
    const memId = memberProfile._id || memberProfile.id || currentUser.id;
    const res = await checkInMember(memId, 'Mobile QR Pass');
    if (res.success) {
      setCheckInNotice(res.message);
      setTimeout(() => setCheckInNotice(''), 5000);
    } else {
      setCheckInNotice(res.message || 'Access punch failed.');
      setTimeout(() => setCheckInNotice(''), 5000);
    }
  };

  // Handle Progress submit
  const handleLogProgress = async (e) => {
    e.preventDefault();
    const memId = memberProfile._id || memberProfile.id || currentUser.id;
    const res = await progressAPI.log({
      memberId: memId,
      weight: logWeight,
      bodyFat: logBodyFat
    });
    if (res.success) {
      setProgressMsg('New body metrics logged successfully to database!');
      setTimeout(() => setProgressMsg(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base">Trainee Athlete Hub</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {memberProfile.plan || 'Active Member'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Welcome back, {currentUser?.name} ({memberProfile.membershipId})</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGymCheckIn}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-1.5"
            >
              <span>📲 Punch In / Pass Scan</span>
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
            >
              Logout →
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Alert */}
        {checkInNotice && (
          <div className="px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center space-x-2">
            <span>✓</span>
            <span>{checkInNotice}</span>
          </div>
        )}

        {/* 2. DIGITAL MEMBERSHIP PASS & HERO STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Digital Member Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">IRONPULSE ACCESS PASS</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  ACTIVE
                </span>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={currentUser?.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/60 shadow-lg"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{currentUser?.name}</h3>
                  <p className="text-xs text-indigo-300 font-semibold">{memberProfile.membershipId}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Membership Tier:</span>
                  <span className="font-bold text-white">{memberProfile.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid Through:</span>
                  <span className="font-semibold text-emerald-400">{memberProfile.expiryDate || '2026-12-31'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QR Code:</span>
                  <span className="font-mono text-[10px] text-slate-400">{memberProfile.qrCode || 'APX-MEMBER-QR'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleGymCheckIn}
              className="mt-6 w-full py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <span>📲 Tap to Clock In / Check Out</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">Hydration Today</span>
              <div className="my-2">
                <div className="text-2xl font-black text-indigo-400">{diet.waterConsumedMl} ml</div>
                <div className="text-xs text-slate-500">Target: {diet.waterTargetMl} ml</div>
              </div>
              <button
                onClick={() => logWater(250)}
                className="py-1.5 px-3 rounded-xl text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 transition-all"
              >
                +250ml Glass
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">Daily Calorie Target</span>
              <div className="my-2">
                <div className="text-2xl font-black text-amber-400">{diet.macroTargets?.calories || 2600} kcal</div>
                <div className="text-xs text-slate-500">Protein: {diet.macroTargets?.protein || 180}g</div>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">Assigned by Coach Viktor</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">Gym Attendance</span>
              <div className="my-2">
                <div className="text-2xl font-black text-emerald-400">14 Visits</div>
                <div className="text-xs text-slate-500">This Month</div>
              </div>
              <span className="text-[11px] text-indigo-400 font-semibold">93% Regularity Streak</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">Rest Timer</span>
              <div className="my-2">
                <div className="text-2xl font-black text-purple-400">
                  {timerSeconds > 0 ? `${timerSeconds}s` : 'Ready'}
                </div>
                <div className="text-xs text-slate-500">{isTimerActive ? 'Resting between sets...' : 'Tap below'}</div>
              </div>
              <div className="flex space-x-1.5">
                <button
                  onClick={() => startRestTimer(45)}
                  className="py-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  45s
                </button>
                <button
                  onClick={() => startRestTimer(60)}
                  className="py-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  60s
                </button>
                <button
                  onClick={() => startRestTimer(90)}
                  className="py-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  90s
                </button>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">Current Body Weight</span>
              <div className="my-2">
                <div className="text-2xl font-black text-white">76.8 kg</div>
                <div className="text-xs text-emerald-400 font-semibold">-7.7 kg down total</div>
              </div>
              <span className="text-[11px] text-slate-400">BMI: 23.7 (Normal)</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">Database Engine</span>
              <div className="my-2">
                <div className="text-sm font-bold text-emerald-400">🍃 MongoDB</div>
                <div className="text-xs text-slate-400">Real-time sync</div>
              </div>
              <span className="text-[11px] text-indigo-400">Connected</span>
            </div>
          </div>
        </div>

        {/* 3. NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('workout')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'workout' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏋️ Today's Workout
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'nutrition' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🥗 Nutrition & Meals
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📅 Attendance History
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'invoices' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            💳 My Invoices & Receipts
          </button>
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'classes' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Book Classes ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'progress' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            📈 Body Progress
          </button>
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB: WORKOUT */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            {currentWorkout ? (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentWorkout.difficulty || 'Intermediate'}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-2">{currentWorkout.title}</h2>
                    <p className="text-xs text-slate-400">
                      Target: {currentWorkout.targetMuscle} • Assigned by {currentWorkout.trainerName || 'Coach Viktor'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400">Estimated Duration</span>
                    <p className="text-lg font-bold text-amber-400">55 Mins • 460 kcal</p>
                  </div>
                </div>

                {/* Exercises Checklist */}
                <div className="mt-6 space-y-4">
                  {(currentWorkout.exercises || []).map((ex, i) => (
                    <div
                      key={ex.id || i}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                            {i + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 pl-8">
                          {ex.sets} Sets × {ex.reps} Reps • Target: <span className="text-amber-400 font-semibold">{ex.targetWeight}</span> • Rest: {ex.restSec || 60}s
                        </p>
                      </div>

                      {/* Interactive Set Checkboxes */}
                      <div className="flex items-center space-x-2 pl-8 md:pl-0">
                        {Array.from({ length: ex.sets || 3 }).map((_, setIdx) => {
                          const isDone = completedSets[`${ex.id}_set_${setIdx}`];
                          return (
                            <button
                              key={setIdx}
                              onClick={() => {
                                toggleSetDone(ex.id, setIdx);
                                if (!isDone) startRestTimer(ex.restSec || 60);
                              }}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                                isDone
                                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {isDone ? '✓' : `S${setIdx + 1}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
                <p className="text-sm text-slate-400">No workout assigned yet. Your coach will upload your routine shortly.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: NUTRITION */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Daily Meal Plan & Nutrition Targets</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(diet.meals || []).map((meal, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-indigo-400">{meal.time}</span>
                      <span className="text-xs font-bold text-amber-400">{meal.calories} kcal • {meal.protein}g Protein</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{meal.name}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{meal.items}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">My Attendance Punch History</h3>
              <button
                onClick={handleGymCheckIn}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                + Check In Now
              </button>
            </div>

            {attendanceLogs.length === 0 ? (
              <p className="text-xs text-slate-400">No punch records logged yet. Use the "Punch In" button when entering gym!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Time In</th>
                      <th className="py-3 px-4">Time Out</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {attendanceLogs.map((log) => (
                      <tr key={log._id || log.id}>
                        <td className="py-3 px-4 font-semibold text-white">{log.date}</td>
                        <td className="py-3 px-4">{log.timeIn}</td>
                        <td className="py-3 px-4">{log.timeOut || '—'}</td>
                        <td className="py-3 px-4">{log.duration || 'Active'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'In Gym'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Membership Invoices & Receipts</h3>

            {payments.length === 0 ? (
              <p className="text-xs text-slate-400">No payment records found.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((inv) => (
                  <div
                    key={inv._id || inv.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{inv.invoiceNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Plan: {inv.plan} • Date: {inv.date} • Method: {inv.method}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-base font-black text-white">${inv.total}</span>
                      <button
                        onClick={() => openInvoice(inv)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
                      >
                        📄 View PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: CLASSES */}
        {activeTab === 'classes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls._id || cls.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                      {cls.intensity} Intensity
                    </span>
                    <span className="text-xs text-amber-400 font-semibold">
                      {cls.bookedCount} / {cls.capacity} Booked
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{cls.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Coach: <span className="text-slate-200">{cls.trainerName}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Schedule: {cls.day} at {cls.time} ({cls.duration})
                  </p>
                </div>

                <button
                  onClick={() => toggleBookClass(cls._id || cls.id)}
                  className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    cls.isBooked
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  }`}
                >
                  {cls.isBooked ? 'Cancel Booking' : 'Reserve My Seat →'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB: PROGRESS */}
        {activeTab === 'progress' && (
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2">Log Body Weight & Measurements</h3>
            <p className="text-xs text-slate-400 mb-6">Track your weight and body composition progress over time</p>

            {progressMsg && (
              <div className="mb-4 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                ✓ {progressMsg}
              </div>
            )}

            <form onSubmit={handleLogProgress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Body Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={logWeight}
                  onChange={(e) => setLogWeight(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Body Fat Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={logBodyFat}
                  onChange={(e) => setLogBodyFat(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all"
              >
                Save Progress to Database →
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
