import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconQrCode,
  IconCheck,
  IconX,
  IconFitFlowLogo
} from '../common/Icons';

export const QrAttendance = () => {
  const { members, checkInMember } = useGym();

  const [selectedMember, setSelectedMember] = useState(members[0] || null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanInputCode, setScanInputCode] = useState('');

  const simulateScan = (member) => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const res = checkInMember(member.id, 'Turnstile QR Scan');
      setScanResult(res);
    }, 600);
  };

  const handleManualScanSubmit = (e) => {
    e.preventDefault();
    if (!scanInputCode.trim()) return;

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const res = checkInMember(scanInputCode.trim(), 'Barcode Optical Scan');
      setScanResult(res);
      setScanInputCode('');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight font-display">
            Contactless Turnstile QR Attendance
          </h2>
          <p className="text-xs text-slate-500">
            Generate digital member wallet passes and simulate high-speed turnstile optical scanner validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Member Digital QR Pass (Wallet Card) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-fitflow-primary uppercase tracking-wider font-bold">
              1. Digital Member Pass Preview
            </span>
            <select
              value={selectedMember?.id}
              onChange={(e) => {
                const mem = members.find(m => m.id === e.target.value);
                setSelectedMember(mem);
                setScanResult(null);
              }}
              className="bg-white border border-[#E5E9F7] text-xs text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:border-fitflow-primary shadow-soft"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.membershipId} - {m.status})
                </option>
              ))}
            </select>
          </div>

          {/* Apple Wallet Style Digital Gym Pass Card */}
          {selectedMember && (
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#584CF4] via-[#6B5CF6] to-[#7C3AED] text-white shadow-soft-lg space-y-6 relative overflow-hidden">
              {/* Top ambient glow circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-900/20 rounded-full blur-2xl pointer-events-none" />

              {/* Pass Header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <IconFitFlowLogo className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="font-display font-black text-base tracking-wider text-white">
                      FITFLOW PASS
                    </span>
                    <span className="block text-[9px] font-mono text-white/70 uppercase">Universal Facility Pass</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  selectedMember.status === 'Active'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-red-500/30 text-white border border-red-300/40'
                }`}>
                  {selectedMember.status}
                </span>
              </div>

              {/* Member Row */}
              <div className="flex items-center gap-4 py-3 border-y border-white/15 relative z-10">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/40 flex-shrink-0 shadow-md"
                />
                <div className="overflow-hidden flex-1">
                  <h3 className="text-lg font-bold text-white truncate font-display">{selectedMember.name}</h3>
                  <div className="text-xs text-white/80 font-semibold">{selectedMember.plan}</div>
                  <div className="text-[11px] text-white/60 font-mono mt-0.5">ID: {selectedMember.membershipId}</div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center shadow-xl relative z-10">
                <svg className="w-44 h-44" viewBox="0 0 100 100" fill="#1E1B4B">
                  <path d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zM40 10h10v20H40zm10 20h20v10H50zm-10 10h20v10H40zm30 10h10v10H70zm10 10h20v20H80zm-40 0h20v10H40zm10 20h20v10H50z" />
                </svg>
                <div className="text-[11px] font-mono font-black text-slate-800 mt-2 tracking-widest uppercase">
                  {selectedMember.qrCode}
                </div>
              </div>

              {/* Test Scan Button */}
              <button
                onClick={() => simulateScan(selectedMember)}
                disabled={isScanning}
                className="w-full py-3 bg-white hover:bg-white/90 text-fitflow-primary font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all relative z-10"
              >
                <IconQrCode className="w-4 h-4 text-fitflow-primary" />
                {isScanning ? 'Verifying with Sensor...' : 'Present Pass to Turnstile Scanner →'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Front Desk / Optical Turnstile Scanner Simulator */}
        <div className="space-y-4">
          <span className="text-xs font-mono text-fitflow-primary uppercase tracking-wider font-bold">
            2. Turnstile Optical Scanner Terminal
          </span>

          <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft space-y-5">
            {/* Camera / Laser Viewport Simulator */}
            <div className="relative h-64 bg-[#F5F7FD] rounded-2xl border-2 border-dashed border-[#584CF4]/30 flex flex-col items-center justify-center overflow-hidden">
              {/* Scanning laser beam animation */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#584CF4] to-transparent animate-pulse shadow-glow-primary" />
              )}

              <div className="w-40 h-40 border border-[#584CF4]/30 rounded-2xl flex flex-col items-center justify-center p-4 relative bg-white shadow-soft">
                {/* Corner markers */}
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-fitflow-primary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-fitflow-primary" />
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-fitflow-primary" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-fitflow-primary" />

                <IconQrCode className={`w-16 h-16 ${isScanning ? 'text-fitflow-primary animate-ping' : 'text-slate-400'}`} />
                <span className="text-[10px] font-mono text-slate-400 mt-2 uppercase">Optical Target</span>
              </div>

              <div className="mt-3 text-xs font-mono text-slate-500">
                {isScanning ? 'Reading token signature...' : 'Aim pass toward scanning reticle'}
              </div>
            </div>

            {/* Quick Barcode/ID Manual Entry */}
            <form onSubmit={handleManualScanSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Or type Member ID (e.g. APX-8820)..."
                value={scanInputCode}
                onChange={(e) => setScanInputCode(e.target.value)}
                className="flex-1 bg-[#F8FAFF] border border-[#E5E9F7] rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-fitflow-primary font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-fitflow-primary hover:bg-fitflow-primaryHover text-white font-bold rounded-xl text-xs font-mono transition-colors shadow-soft"
              >
                Scan Code
              </button>
            </form>

            {/* Scan Result Feedback Card */}
            {scanResult && (
              <div className={`p-5 rounded-2xl border transition-all animate-in zoom-in duration-200 ${
                scanResult.success
                  ? 'bg-[#E8F8F0] border-[#10B981] text-[#065F46]'
                  : 'bg-[#FEECEB] border-[#EF4444] text-[#991B1B]'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    scanResult.success ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white'
                  }`}>
                    {scanResult.success ? <IconCheck className="w-5 h-5" /> : <IconX className="w-5 h-5" />}
                  </div>

                  <div>
                    <h4 className={`text-base font-bold font-display ${
                      scanResult.success ? 'text-[#065F46]' : 'text-[#991B1B]'
                    }`}>
                      {scanResult.success ? 'ACCESS GRANTED • TURNSTILE UNLOCKED' : 'ACCESS DENIED'}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed opacity-90">
                      {scanResult.message}
                    </p>

                    {scanResult.member && (
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-black/10 text-xs font-mono">
                        <span>Athlete: <strong>{scanResult.member.name}</strong></span>
                        <span>•</span>
                        <span>{scanResult.member.plan}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
