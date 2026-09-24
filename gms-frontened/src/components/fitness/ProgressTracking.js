import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconPlus,
  IconCheck,
  IconX
} from '../common/Icons';

export const ProgressTracking = () => {
  const { progress, addProgressLog } = useGym();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    weight: progress.currentWeight,
    bodyFat: progress.currentBodyFat,
    chestCm: 102,
    waistCm: 79,
    armsCm: 39
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProgressLog(formData);
    showToast(`Saved progress metric! New weight: ${formData.weight} kg`);
    setIsModalOpen(false);
  };

  const { currentWeight, targetWeight, startWeight, currentBodyFat, targetBodyFat, bmi, history } = progress;

  const totalLossNeeded = startWeight - targetWeight;
  const currentLost = startWeight - currentWeight;
  const progressPercent = Math.min(100, Math.round((currentLost / totalLossNeeded) * 100));

  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-[#10B981] bg-[#E8F8F0]';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-[#584CF4] bg-[#EEF0FE]';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-[#F59E0B] bg-[#FFFBEB]';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-[#EF4444] bg-[#FEECEB]';
  }

  const chartWidth = 600;
  const chartHeight = 180;
  const weights = history.map(h => h.weight);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;

  const points = history.map((h, i) => {
    const x = (i / (history.length - 1 || 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - ((h.weight - minW) / (maxW - minW || 1)) * (chartHeight - 40) - 20;
    return { x, y, weight: h.weight, date: h.date };
  });

  const pathD = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

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
            Body Composition & Progress Tracking
          </h2>
          <p className="text-xs text-[#64748B]">
            Log bodyweight, body fat percentage, muscular circumferences, and BMI trajectory.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
        >
          <IconPlus className="w-4 h-4" />
          Record Measurement
        </button>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Current Bodyweight</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#111827] font-display">{currentWeight} kg</span>
            <span className="text-xs font-mono text-[#10B981] font-bold">
              -{currentLost.toFixed(1)} kg total
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-2">
            Goal: {targetWeight} kg ({progressPercent}% achieved)
          </div>
          <div className="w-full bg-[#F5F7FD] rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#584CF4] to-[#7C3AED] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Body Fat Percentage</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#584CF4] font-display">{currentBodyFat}%</span>
            <span className="text-xs font-mono text-[#584CF4] font-bold bg-[#EEF0FE] px-2 py-0.5 rounded-full">Athletic</span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-2">
            Target: {targetBodyFat}% • -3.4% since baseline
          </div>
          <div className="w-full bg-[#F5F7FD] rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-[#584CF4] h-full rounded-full" style={{ width: '74%' }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Body Mass Index (BMI)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-[#111827] font-display">{bmi}</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${bmiColor}`}>
              {bmiCategory}
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-2">
            Height: {progress.heightCm} cm • Optimal: 18.5 - 24.9
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-xs font-mono text-[#64748B] uppercase font-semibold">Circumferences</span>
          <div className="grid grid-cols-3 gap-2 mt-2 font-mono">
            <div>
              <span className="text-[10px] text-[#64748B]">Chest</span>
              <div className="text-sm font-bold text-[#111827]">102 cm</div>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B]">Waist</span>
              <div className="text-sm font-bold text-[#111827]">79 cm</div>
            </div>
            <div>
              <span className="text-[10px] text-[#64748B]">Arms</span>
              <div className="text-sm font-bold text-[#584CF4]">39 cm</div>
            </div>
          </div>
          <div className="text-[10px] text-[#10B981] font-mono mt-2 font-semibold">+2.0 cm arm growth logged</div>
        </div>
      </div>

      {/* SVG Line Chart in FitFlow Purple */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#111827] tracking-tight">Bodyweight Trajectory</h3>
            <p className="text-xs text-[#64748B]">Multi-month progress curve showing lean fat-loss progression</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#EEF0FE] text-xs font-mono text-[#584CF4] font-bold">
            Current: {currentWeight} kg
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px] h-48 relative">
            <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              <line x1="20" y1="30" x2={chartWidth - 20} y2="30" stroke="#EEF0FE" strokeDasharray="4" />
              <line x1="20" y1="80" x2={chartWidth - 20} y2="80" stroke="#EEF0FE" strokeDasharray="4" />
              <line x1="20" y1="130" x2={chartWidth - 20} y2="130" stroke="#EEF0FE" strokeDasharray="4" />

              <defs>
                <linearGradient id="fitflowLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#584CF4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#584CF4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {points.length > 0 && (
                <path
                  d={`${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`}
                  fill="url(#fitflowLineGrad)"
                />
              )}

              <path
                d={pathD}
                fill="none"
                stroke="#584CF4"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {points.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="5" className="fill-white stroke-[#584CF4] stroke-[3px]" />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#111827" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    {p.weight}kg
                  </text>
                  <text x={p.x} y={chartHeight - 4} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">
                    {p.date.substring(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Measurement Logs History Table */}
      <div className="bg-white rounded-3xl border border-[#E5E9F7] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5E9F7]">
          <h3 className="text-sm font-bold text-[#111827]">Measurement Logs History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F5F7FD] border-b border-[#E5E9F7] text-[#64748B] uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Date Recorded</th>
                <th className="py-3 px-4">Body Weight</th>
                <th className="py-3 px-4">Body Fat %</th>
                <th className="py-3 px-4">Chest</th>
                <th className="py-3 px-4">Waist</th>
                <th className="py-3 px-4">Biceps / Arms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F7] text-[#334155]">
              {history.map((log, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFF] transition-colors">
                  <td className="py-3 px-4 text-[#111827] font-bold">{log.date}</td>
                  <td className="py-3 px-4 text-[#584CF4] font-bold">{log.weight} kg</td>
                  <td className="py-3 px-4 text-[#10B981] font-bold">{log.bodyFat}%</td>
                  <td className="py-3 px-4">{log.chestCm} cm</td>
                  <td className="py-3 px-4">{log.waistCm} cm</td>
                  <td className="py-3 px-4">{log.armsCm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Measurement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E9F7] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
              <h3 className="text-base font-bold text-[#111827] font-display">Record Progress Measurements</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94A3B8] hover:text-[#111827]">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Bodyweight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] font-mono focus:outline-none focus:border-[#584CF4]"
                  />
                </div>

                <div>
                  <label className="block text-[#64748B] font-mono uppercase mb-1">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFat}
                    onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                    className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] font-mono focus:outline-none focus:border-[#584CF4]"
                  />
                </div>
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
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
