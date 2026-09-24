import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconFlame,
  IconDroplet,
  IconPlus,
  IconCheck,
  IconX
} from '../common/Icons';

export const DietNutrition = () => {
  const { diet, logWater, logMeal } = useGym();

  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Breakfast',
    name: '',
    time: '09:00 AM',
    calories: 450,
    protein: 35,
    carbs: 45,
    fats: 12,
    itemsText: 'Eggs, Whole wheat toast, Avocado'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWaterAdd = (amount) => {
    logWater(amount);
    showToast(`Logged +${amount}ml water!`);
  };

  const handleMealSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    logMeal({
      type: formData.type,
      name: formData.name,
      time: formData.time,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      carbs: Number(formData.carbs),
      fats: Number(formData.fats),
      items: formData.itemsText.split(',').map(i => i.trim()).filter(Boolean)
    });

    showToast(`Logged meal: ${formData.name}`);
    setIsMealModalOpen(false);
  };

  const { macroTargets, consumed, waterTargetMl, waterConsumedMl, meals } = diet;

  const calPercent = Math.min(100, Math.round((consumed.calories / macroTargets.calories) * 100));
  const proPercent = Math.min(100, Math.round((consumed.protein / macroTargets.protein) * 100));
  const carbPercent = Math.min(100, Math.round((consumed.carbs / macroTargets.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((consumed.fats / macroTargets.fats) * 100));
  const waterPercent = Math.min(100, Math.round((waterConsumedMl / waterTargetMl) * 100));

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
            Diet, Nutrition & Hydration
          </h2>
          <p className="text-xs text-[#64748B]">
            Automated macro breakdown, meal schedule, and real-time hydration logging.
          </p>
        </div>

        <button
          onClick={() => setIsMealModalOpen(true)}
          className="px-4 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
        >
          <IconPlus className="w-4 h-4" />
          Log Meal
        </button>
      </div>

      {/* Top 4 Macro Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Daily Calories</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEECEB] text-[#EF4444] flex items-center justify-center">
              <IconFlame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#111827] font-display">{consumed.calories}</span>
            <span className="text-xs font-mono text-[#64748B]">/ {macroTargets.calories} kcal</span>
          </div>
          <div className="w-full bg-[#F5F7FD] rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[#EF4444] h-full rounded-full transition-all duration-500"
              style={{ width: `${calPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-1.5 flex justify-between">
            <span>{calPercent}% Consumed</span>
            <span>{macroTargets.calories - consumed.calories} kcal left</span>
          </div>
        </div>

        {/* Protein */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Protein Target</span>
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#E8F8F0] px-2 py-0.5 rounded-full">Anabolic</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#10B981] font-display">{consumed.protein}g</span>
            <span className="text-xs font-mono text-[#64748B]">/ {macroTargets.protein}g</span>
          </div>
          <div className="w-full bg-[#F5F7FD] rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${proPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-1.5 flex justify-between">
            <span>{proPercent}% Met</span>
            <span>{Math.max(0, macroTargets.protein - consumed.protein)}g left</span>
          </div>
        </div>

        {/* Carbs */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Carbohydrates</span>
            <span className="text-xs font-mono font-bold text-[#584CF4] bg-[#EEF0FE] px-2 py-0.5 rounded-full">Energy</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#584CF4] font-display">{consumed.carbs}g</span>
            <span className="text-xs font-mono text-[#64748B]">/ {macroTargets.carbs}g</span>
          </div>
          <div className="w-full bg-[#F5F7FD] rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[#584CF4] h-full rounded-full transition-all duration-500"
              style={{ width: `${carbPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-1.5 flex justify-between">
            <span>{carbPercent}% Met</span>
            <span>{Math.max(0, macroTargets.carbs - consumed.carbs)}g left</span>
          </div>
        </div>

        {/* Fats */}
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Healthy Fats</span>
            <span className="text-xs font-mono font-bold text-[#7C3AED] bg-purple-50 px-2 py-0.5 rounded-full">Hormones</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#111827] font-display">{consumed.fats}g</span>
            <span className="text-xs font-mono text-[#64748B]">/ {macroTargets.fats}g</span>
          </div>
          <div className="w-full bg-[#F5F7FD] rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-[#7C3AED] h-full rounded-full transition-all duration-500"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
          <div className="text-[10px] font-mono text-[#64748B] mt-1.5 flex justify-between">
            <span>{fatPercent}% Met</span>
            <span>{Math.max(0, macroTargets.fats - consumed.fats)}g left</span>
          </div>
        </div>
      </div>

      {/* Hydration Tracker Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF0FE] flex items-center justify-center text-[#584CF4]">
            <IconDroplet className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">Hydration Tracker</div>
            <div className="text-2xl font-black text-[#111827] font-display">
              {(waterConsumedMl / 1000).toFixed(2)} L <span className="text-xs text-[#64748B] font-mono">/ {(waterTargetMl / 1000).toFixed(1)} L Goal</span>
            </div>
            <div className="text-xs text-[#584CF4] font-mono mt-0.5">{waterPercent}% completed today</div>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleWaterAdd(250)}
            className="px-4 py-2 bg-[#F5F7FD] hover:bg-[#EEF0FE] text-[#111827] border border-[#E5E9F7] rounded-xl text-xs font-mono font-bold transition-all"
          >
            +250 ml (Cup)
          </button>
          <button
            onClick={() => handleWaterAdd(500)}
            className="px-4 py-2 bg-[#F5F7FD] hover:bg-[#EEF0FE] text-[#111827] border border-[#E5E9F7] rounded-xl text-xs font-mono font-bold transition-all"
          >
            +500 ml (Bottle)
          </button>
          <button
            onClick={() => handleWaterAdd(1000)}
            className="px-4 py-2 bg-[#584CF4] hover:bg-[#483BE0] text-white rounded-xl text-xs font-mono font-bold shadow-md transition-all"
          >
            +1.0 L (Shaker)
          </button>
        </div>
      </div>

      {/* Daily Meals Schedule */}
      <div>
        <h3 className="text-base font-bold text-[#111827] mb-4">Today's Meal Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0FE] text-[#584CF4]">
                  {meal.type}
                </span>
                <span className="text-xs text-[#64748B] font-mono">{meal.time}</span>
              </div>

              <h4 className="text-base font-bold text-[#111827] font-display mt-2 mb-1">
                {meal.name}
              </h4>

              <div className="flex items-center gap-3 my-3 text-xs font-mono">
                <span className="text-[#EF4444] font-bold">{meal.calories} kcal</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="text-[#10B981]">P: {meal.protein}g</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="text-[#584CF4]">C: {meal.carbs}g</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="text-[#64748B]">F: {meal.fats}g</span>
              </div>

              <div className="pt-3 border-t border-[#E5E9F7] flex flex-wrap gap-1.5">
                {meal.items.map((item, i) => (
                  <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#F5F7FD] text-[#475569] border border-[#E5E9F7]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Meal Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E9F7] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
              <h3 className="text-base font-bold text-[#111827] font-display">Log Nutrition Entry</h3>
              <button onClick={() => setIsMealModalOpen(false)} className="text-[#94A3B8] hover:text-[#111827]">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMealSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Meal Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Pre-Workout Snack">Pre-Workout</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] font-mono focus:outline-none focus:border-[#584CF4]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Meal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken & Quinoa Salad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[#64748B] font-mono uppercase text-[10px] mb-1">Calories</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-2 py-1.5 text-[#111827] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] font-mono uppercase text-[10px] mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-2 py-1.5 text-[#111827] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] font-mono uppercase text-[10px] mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-2 py-1.5 text-[#111827] font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#64748B] font-mono uppercase text-[10px] mb-1">Fats (g)</label>
                  <input
                    type="number"
                    value={formData.fats}
                    onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-2 py-1.5 text-[#111827] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E9F7]">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#475569] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold shadow-md"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
