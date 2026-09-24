import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { workoutsAPI, dietsAPI } from '../../services/api';

export const TrainerDashboard = () => {
  const { currentUser, members, classes, fetchAllData, logout } = useGym();
  const [activeTrainerTab, setActiveTrainerTab] = useState('trainees'); // 'trainees' | 'classes' | 'profile'

  // Modal States
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  // Workout Form State
  const [workoutTitle, setWorkoutTitle] = useState('Chest & Triceps Hypertrophy');
  const [targetMuscle, setTargetMuscle] = useState('Chest / Triceps');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [exercisesList, setExercisesList] = useState([
    { id: 'ex_1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', targetWeight: '75 kg', restSec: 90 },
    { id: 'ex_2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', targetWeight: '26 kg', restSec: 60 },
    { id: 'ex_3', name: 'Cable Rope Tricep Pushdown', sets: 4, reps: '12-15', targetWeight: '25 kg', restSec: 45 }
  ]);

  // Diet Form State
  const [dailyCalories, setDailyCalories] = useState(2600);
  const [protein, setProtein] = useState(180);
  const [carbs, setCarbs] = useState(280);
  const [fats, setFats] = useState(65);
  const [waterTargetMl, setWaterTargetMl] = useState(3500);
  const [mealsList, setMealsList] = useState([
    { time: '08:00 AM', name: 'Power Breakfast', items: '4 Egg whites + 2 whole eggs, 80g oats with berries', calories: 580, protein: 38 },
    { time: '01:30 PM', name: 'Lean Protein Lunch', items: '200g Grilled chicken breast, 150g brown rice, broccoli', calories: 650, protein: 52 },
    { time: '08:00 PM', name: 'Recovery Dinner', items: '180g Salmon fillet, sweet potato, mixed greens', calories: 620, protein: 46 }
  ]);

  // Handle Workout Submit
  const handleAssignWorkout = async (e) => {
    e.preventDefault();
    if (!selectedTrainee) return;

    const res = await workoutsAPI.assign({
      memberId: selectedTrainee._id || selectedTrainee.id,
      memberName: selectedTrainee.name,
      trainerId: currentUser.trainerProfile?._id || currentUser.id,
      trainerName: currentUser.name,
      title: workoutTitle,
      targetMuscle,
      difficulty,
      exercises: exercisesList
    });

    if (res.success) {
      setActionSuccess(`Workout routine "${workoutTitle}" assigned to ${selectedTrainee.name}!`);
      setIsWorkoutModalOpen(false);
      fetchAllData();
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // Handle Diet Submit
  const handleAssignDiet = async (e) => {
    e.preventDefault();
    if (!selectedTrainee) return;

    const res = await dietsAPI.assign({
      memberId: selectedTrainee._id || selectedTrainee.id,
      memberName: selectedTrainee.name,
      trainerId: currentUser.trainerProfile?._id || currentUser.id,
      trainerName: currentUser.name,
      dailyCalories,
      protein,
      carbs,
      fats,
      waterTargetMl,
      meals: mealsList
    });

    if (res.success) {
      setActionSuccess(`Custom ${dailyCalories} kcal diet plan assigned to ${selectedTrainee.name}!`);
      setIsDietModalOpen(false);
      fetchAllData();
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  const addExerciseRow = () => {
    setExercisesList([
      ...exercisesList,
      { id: `ex_${Date.now()}`, name: 'Dumbbell Lateral Raise', sets: 3, reps: '15', targetWeight: '12 kg', restSec: 45 }
    ]);
  };

  const addMealRow = () => {
    setMealsList([
      ...mealsList,
      { time: '05:00 PM', name: 'Snack / Pre-Workout', items: 'Whey protein shake + 1 banana', calories: 250, protein: 25 }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-500/20">
              🏋️
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base">Trainer Coaching Hub</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  Head Coach
                </span>
              </div>
              <p className="text-xs text-slate-400">Signed in as {currentUser?.name || 'Coach'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTrainerTab('trainees')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTrainerTab === 'trainees' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                My Trainees ({members.length})
              </button>
              <button
                onClick={() => setActiveTrainerTab('classes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTrainerTab === 'classes' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                My Classes ({classes.length})
              </button>
              <button
                onClick={() => setActiveTrainerTab('profile')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTrainerTab === 'profile' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Coach Profile
              </button>
            </div>

            <button
              onClick={logout}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all flex items-center space-x-1.5"
            >
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Alert */}
        {actionSuccess && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center space-x-2">
            <span>✓</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Coach Stat Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl font-bold">
              👥
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Assigned Trainees</p>
              <h4 className="text-2xl font-black text-white mt-0.5">{members.length}</h4>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl font-bold">
              ⚡
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Scheduled Classes</p>
              <h4 className="text-2xl font-black text-white mt-0.5">{classes.length}</h4>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-bold">
              ★
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Coach Rating</p>
              <h4 className="text-2xl font-black text-white mt-0.5">4.9 / 5.0</h4>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center space-x-4 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-2xl font-bold">
              🍃
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Database Status</p>
              <h4 className="text-sm font-bold text-emerald-400 mt-1">MongoDB Live</h4>
            </div>
          </div>
        </div>

        {/* TAB 1: TRAINEES ROSTER */}
        {activeTrainerTab === 'trainees' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Client Trainees Roster</h2>
                <p className="text-xs text-slate-400">Assign tailored workout regimens and nutrition programs</p>
              </div>
            </div>

            {members.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
                <p className="text-sm text-slate-400">No trainees registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <div
                    key={member._id || member.id}
                    className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={member.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white">{member.name}</h3>
                          <span className="text-xs text-indigo-400 font-semibold">{member.membershipId}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Active Plan:</span>
                          <span className="font-semibold text-emerald-400">{member.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Contact:</span>
                          <span>{member.phone || member.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Sessions Attended:</span>
                          <span className="font-bold text-amber-400">{member.attendanceCount || 0} Visits</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Membership Valid Until:</span>
                          <span>{member.expiryDate || 'Active'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedTrainee(member);
                          setIsWorkoutModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 transition-all text-center"
                      >
                        💪 Assign Workout
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTrainee(member);
                          setIsDietModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all text-center"
                      >
                        🥗 Assign Diet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY CLASSES */}
        {activeTrainerTab === 'classes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Group Training Sessions & Classes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classes.map((c) => (
                <div key={c._id || c.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                      {c.intensity || 'High'} Intensity
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {c.bookedCount || 0} / {c.capacity || 20} Booked
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    Room: {c.room} • {c.day} • {c.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COACH PROFILE */}
        {activeTrainerTab === 'profile' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="flex items-center space-x-5">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150'}
                alt="Trainer"
                className="w-20 h-20 rounded-3xl object-cover border-2 border-amber-500 shadow-xl shadow-amber-500/20"
              />
              <div>
                <h3 className="text-2xl font-black text-white">{currentUser?.name}</h3>
                <p className="text-xs font-bold text-amber-400 mt-0.5">Certified Strength & Conditioning Specialist</p>
                <p className="text-xs text-slate-400 mt-1">{currentUser?.email}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-4 text-xs text-slate-300">
              <div>
                <span className="font-bold text-white block mb-1">Specialties & Coaching Philosophy:</span>
                <p className="text-slate-400 leading-relaxed">
                  Focusing on progressive overload, compound movements, joint integrity, and precision macronutrient fueling. Experienced with collegiate athletes and busy executives seeking body recomposition.
                </p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Certifications:</span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-semibold mr-2">CSCS</span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-semibold mr-2">USAW Level 2</span>
                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-semibold">Precision Nutrition L1</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ASSIGN WORKOUT */}
      {isWorkoutModalOpen && selectedTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Assign Workout Routine</h3>
                <p className="text-xs text-amber-400">Trainee: {selectedTrainee.name} ({selectedTrainee.membershipId})</p>
              </div>
              <button
                onClick={() => setIsWorkoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignWorkout} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Routine Title</label>
                  <input
                    type="text"
                    required
                    value={workoutTitle}
                    onChange={(e) => setWorkoutTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Muscle</label>
                  <input
                    type="text"
                    value={targetMuscle}
                    onChange={(e) => setTargetMuscle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced (Heavy)</option>
                </select>
              </div>

              {/* Exercises List */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase">Exercises ({exercisesList.length})</span>
                  <button
                    type="button"
                    onClick={addExerciseRow}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-2.5">
                  {exercisesList.map((ex, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-5 gap-2 items-center text-xs">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={ex.name}
                          onChange={(e) => {
                            const copy = [...exercisesList];
                            copy[i].name = e.target.value;
                            setExercisesList(copy);
                          }}
                          placeholder="Exercise name"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => {
                            const copy = [...exercisesList];
                            copy[i].sets = Number(e.target.value);
                            setExercisesList(copy);
                          }}
                          placeholder="Sets"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={ex.reps}
                          onChange={(e) => {
                            const copy = [...exercisesList];
                            copy[i].reps = e.target.value;
                            setExercisesList(copy);
                          }}
                          placeholder="Reps"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={ex.targetWeight}
                          onChange={(e) => {
                            const copy = [...exercisesList];
                            copy[i].targetWeight = e.target.value;
                            setExercisesList(copy);
                          }}
                          placeholder="Weight"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 transition-all mt-4"
              >
                Save & Assign Routine to Trainee →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN DIET */}
      {isDietModalOpen && selectedTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Assign Nutrition & Diet Plan</h3>
                <p className="text-xs text-emerald-400">Trainee: {selectedTrainee.name}</p>
              </div>
              <button
                onClick={() => setIsDietModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignDiet} className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={fats}
                    onChange={(e) => setFats(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Water (ml)</label>
                  <input
                    type="number"
                    value={waterTargetMl}
                    onChange={(e) => setWaterTargetMl(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              {/* Meals Schedule */}
              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase">Meal Schedule ({mealsList.length})</span>
                  <button
                    type="button"
                    onClick={addMealRow}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    + Add Meal
                  </button>
                </div>

                <div className="space-y-2.5">
                  {mealsList.map((m, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-4 gap-2 items-center text-xs">
                      <div>
                        <input
                          type="text"
                          value={m.time}
                          onChange={(e) => {
                            const copy = [...mealsList];
                            copy[i].time = e.target.value;
                            setMealsList(copy);
                          }}
                          placeholder="Time"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={m.items}
                          onChange={(e) => {
                            const copy = [...mealsList];
                            copy[i].items = e.target.value;
                            setMealsList(copy);
                          }}
                          placeholder="Food items"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={m.calories}
                          onChange={(e) => {
                            const copy = [...mealsList];
                            copy[i].calories = Number(e.target.value);
                            setMealsList(copy);
                          }}
                          placeholder="kcal"
                          className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all mt-4"
              >
                Save & Assign Diet to Trainee →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
