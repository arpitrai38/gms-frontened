import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconDumbbell,
  IconPlay,
  IconPause,
  IconRotateCcw,
  IconCheck,
  IconFlame
} from '../common/Icons';

export const WorkoutPlanner = () => {
  const {
    exercises,
    routines,
    activeWorkout,
    startWorkoutSession,
    finishWorkoutSession,
    setActiveWorkout
  } = useGym();

  const [selectedMuscle, setSelectedMuscle] = useState('ALL');
  const [selectedRoutine, setSelectedRoutine] = useState(routines[0] || null);

  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (restSecondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restSecondsLeft]);

  const handleStartWorkout = (routine) => {
    startWorkoutSession(routine);
    setSelectedRoutine(routine);
    setRestSecondsLeft(60);
    setIsTimerRunning(false);
  };

  const handleCompleteSet = (exerciseIndex, setIndex) => {
    if (!activeWorkout) return;

    const key = `${exerciseIndex}_${setIndex}`;
    const newCompleted = { ...activeWorkout.completedSets, [key]: true };
    const newCalories = (activeWorkout.burnedCalories || 0) + 18;

    setActiveWorkout({
      ...activeWorkout,
      completedSets: newCompleted,
      burnedCalories: newCalories
    });

    setRestSecondsLeft(60);
    setIsTimerRunning(true);
  };

  const muscles = ['ALL', 'Chest', 'Back', 'Legs', 'Deltoids', 'Arms', 'Abdominals'];

  const filteredExercises = exercises.filter((ex) => {
    if (selectedMuscle === 'ALL') return true;
    return ex.targetMuscle.toLowerCase().includes(selectedMuscle.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#111827] tracking-tight font-display">
            Smart Workout Programs & Training Player
          </h2>
          <p className="text-xs text-[#64748B]">
            High-volume hypertrophy routines, interactive set checklist, and automated rest countdown timer.
          </p>
        </div>

        {activeWorkout ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#EEF0FE] text-[#584CF4] font-bold text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#584CF4] animate-ping" /> ACTIVE SESSION
            </span>
            <button
              onClick={finishWorkoutSession}
              className="px-4 py-2 rounded-2xl bg-[#EF4444] text-white font-bold text-xs shadow-md"
            >
              Finish & Log
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleStartWorkout(selectedRoutine || routines[0])}
            className="px-5 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
          >
            <IconPlay className="w-4 h-4 fill-current" />
            Launch Active Workout
          </button>
        )}
      </div>

      {/* Active Workout Live Session Player */}
      {activeWorkout && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#584CF4] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_15px_35px_rgba(88,76,244,0.3)] relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/20">
            <div>
              <div className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-wider">
                Now Training
              </div>
              <h3 className="text-xl font-black text-white font-display">
                {activeWorkout.routine.title}
              </h3>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] font-mono text-white/70 uppercase">Estimated Burn</div>
                <div className="text-xl font-black text-white font-display flex items-center gap-1">
                  <IconFlame className="w-4 h-4 text-[#FDE047]" />
                  {activeWorkout.burnedCalories || 0} kcal
                </div>
              </div>

              {/* Rest Timer */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
                <div className="text-center px-2">
                  <div className="text-[9px] font-mono text-white/70 uppercase">Rest Timer</div>
                  <div className="text-lg font-mono font-black text-white">
                    00:{restSecondsLeft < 10 ? `0${restSecondsLeft}` : restSecondsLeft}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2 rounded-xl bg-white text-[#584CF4] hover:bg-slate-50"
                  >
                    {isTimerRunning ? <IconPause className="w-3.5 h-3.5 fill-current" /> : <IconPlay className="w-3.5 h-3.5 fill-current" />}
                  </button>
                  <button
                    onClick={() => {
                      setRestSecondsLeft(60);
                      setIsTimerRunning(false);
                    }}
                    className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30"
                  >
                    <IconRotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {activeWorkout.routine.exercises.map((ex, exIdx) => (
              <div key={ex.id || exIdx} className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-bold text-white">{ex.name}</span>
                    <span className="text-xs font-mono text-white/80 ml-2">
                      Target: {ex.weightKg ? `${ex.weightKg} kg • ` : ''}{ex.reps} reps
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#FDE047] font-bold">{ex.sets} Sets</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {Array.from({ length: ex.sets }).map((_, sIdx) => {
                    const setNum = sIdx + 1;
                    const isDone = !!activeWorkout.completedSets[`${exIdx}_${setNum}`];
                    return (
                      <button
                        key={sIdx}
                        onClick={() => handleCompleteSet(exIdx, setNum)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                          isDone
                            ? 'bg-white text-[#584CF4] shadow-md'
                            : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                        }`}
                      >
                        <IconCheck className="w-3.5 h-3.5" />
                        Set {setNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Routine Cards */}
      <div>
        <h3 className="text-base font-bold text-[#111827] mb-3">Preset Smart Routines</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routines.map((routine) => (
            <div
              key={routine.id}
              onClick={() => setSelectedRoutine(routine)}
              className={`p-5 rounded-3xl cursor-pointer transition-all bg-white ${
                selectedRoutine?.id === routine.id
                  ? 'border-2 border-[#584CF4] shadow-[0_12px_32px_rgba(88,76,244,0.12)] ring-2 ring-[#EEF0FE]'
                  : 'border border-[#E5E9F7] shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EEF0FE] text-[#584CF4]">
                  {routine.level}
                </span>
                <span className="text-xs text-[#64748B] font-mono">{routine.durationMinutes} mins</span>
              </div>

              <h4 className="text-base font-bold text-[#111827] font-display mt-2 mb-1">
                {routine.title}
              </h4>

              <div className="flex items-center gap-2 text-xs text-[#EF4444] font-mono mb-3">
                <IconFlame className="w-3.5 h-3.5" />
                ~{routine.caloriesEst} kcal burn
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {routine.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#F5F7FD] text-[#64748B] border border-[#E5E9F7]">
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartWorkout(routine);
                }}
                className="w-full py-2 rounded-xl bg-[#F5F7FD] hover:bg-[#584CF4] hover:text-white text-[#584CF4] border border-[#E5E9F7] text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <IconPlay className="w-3.5 h-3.5 fill-current" />
                Start Session
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Database */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#111827]">Curated Exercise Library</h3>
            <p className="text-xs text-[#64748B]">Database of strength and hypertrophy movements</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {muscles.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-colors ${
                  selectedMuscle === m
                    ? 'bg-[#584CF4] text-white shadow-sm'
                    : 'bg-[#F5F7FD] text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredExercises.map((ex) => (
            <div key={ex.id} className="p-4 rounded-2xl bg-[#F5F7FD] border border-[#E5E9F7] hover:border-[#584CF4]/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-[#EEF0FE] text-[#584CF4] flex items-center justify-center mb-3">
                <IconDumbbell className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[#111827] leading-snug">{ex.name}</h4>
              <div className="text-xs text-[#584CF4] font-mono mt-1">{ex.targetMuscle}</div>
              <div className="text-[11px] text-[#64748B] font-mono mt-2 pt-2 border-t border-[#E5E9F7] flex items-center justify-between">
                <span>{ex.equipment}</span>
                <span className="text-[#584CF4] font-bold">{ex.defaultSets} × {ex.defaultReps}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
