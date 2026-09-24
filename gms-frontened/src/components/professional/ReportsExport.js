import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconDownload,
  IconCheck,
  IconUsers,
  IconCreditCard,
  IconCalendar
} from '../common/Icons';

export const ReportsExport = () => {
  const { members, payments, attendanceLogs, trainers } = useGym();
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to trigger file download in browser
  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}!`);
  };

  // Export Members CSV
  const exportMembersCSV = () => {
    const headers = ['ID', 'MembershipID', 'Name', 'Email', 'Phone', 'Plan', 'Status', 'JoinDate', 'ExpiryDate', 'AttendanceCount'];
    const rows = members.map(m => [
      m.id,
      m.membershipId,
      `"${m.name}"`,
      m.email,
      m.phone,
      m.plan,
      m.status,
      m.joinDate,
      m.expiryDate,
      m.attendanceCount
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(`FitFlow_Members_${new Date().toISOString().split('T')[0]}.csv`, csvContent, 'text/csv;charset=utf-8;');
  };

  // Export Payments CSV
  const exportPaymentsCSV = () => {
    const headers = ['InvoiceNumber', 'MemberName', 'Plan', 'Amount', 'Tax', 'Total', 'PaymentMethod', 'Date', 'Status'];
    const rows = payments.map(p => [
      p.invoiceNumber,
      `"${p.memberName}"`,
      `"${p.plan}"`,
      p.amount,
      p.tax,
      p.total,
      `"${p.method}"`,
      p.date,
      p.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(`FitFlow_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`, csvContent, 'text/csv;charset=utf-8;');
  };

  // Export Attendance CSV
  const exportAttendanceCSV = () => {
    const headers = ['Date', 'Athlete', 'Plan', 'TimeIn', 'TimeOut', 'Duration', 'VerificationMethod', 'Status'];
    const rows = attendanceLogs.map(a => [
      a.date,
      `"${a.memberName}"`,
      a.plan,
      a.timeIn,
      a.timeOut || 'N/A',
      a.duration,
      `"${a.method}"`,
      a.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(`FitFlow_Attendance_${new Date().toISOString().split('T')[0]}.csv`, csvContent, 'text/csv;charset=utf-8;');
  };

  // Export Full JSON Backup
  const exportFullJson = () => {
    const dump = {
      gym: 'FitFlow Performance Club',
      exportedAt: new Date().toISOString(),
      members,
      payments,
      attendanceLogs,
      trainers
    };
    downloadFile(`FitFlow_Full_System_Backup_${Date.now()}.json`, JSON.stringify(dump, null, 2), 'application/json');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-white border border-[#584CF4]/30 text-[#584CF4] font-bold shadow-soft-lg flex items-center gap-2 animate-in fade-in">
          <IconCheck className="w-5 h-5 text-[#584CF4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight font-display">
            Business Reports & Data Exports
          </h2>
          <p className="text-xs text-slate-500">
            Export structured financial ledgers, member demographics, and attendance compliance records.
          </p>
        </div>

        <button
          onClick={exportFullJson}
          className="px-4 py-2.5 bg-white hover:bg-fitflow-lilac text-fitflow-primary border border-fitflow-border rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-soft transition-all"
        >
          <IconDownload className="w-4 h-4" />
          Full JSON Backup
        </button>
      </div>

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Report */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-fitflow-lilac text-fitflow-primary flex items-center justify-center mb-4">
              <IconUsers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Athletes & Members Report</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Complete member records including membership ID, plan tiers, join and expiration dates, medical restrictions, and emergency numbers.
            </p>
            <div className="text-xs font-mono text-fitflow-primary mt-4 font-bold bg-fitflow-lilac/70 px-3 py-1.5 rounded-lg inline-block">
              {members.length} Athlete Records Available
            </div>
          </div>

          <button
            onClick={exportMembersCSV}
            className="mt-6 w-full py-2.5 bg-fitflow-primary hover:bg-fitflow-primaryHover text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-primary transition-all"
          >
            <IconDownload className="w-4 h-4" />
            Export Members (CSV)
          </button>
        </div>

        {/* Financial Revenue Report */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#10B981] flex items-center justify-center mb-4">
              <IconCreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Financial Billing Ledger</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Itemized transaction logs with invoice numbers, payment processors, tax calculations, dates, and outstanding debt balances.
            </p>
            <div className="text-xs font-mono text-[#10B981] mt-4 font-bold bg-[#E8F8F0] px-3 py-1.5 rounded-lg inline-block">
              {payments.length} Transaction Invoices Ready
            </div>
          </div>

          <button
            onClick={exportPaymentsCSV}
            className="mt-6 w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-soft transition-all"
          >
            <IconDownload className="w-4 h-4" />
            Export Ledger (CSV)
          </button>
        </div>

        {/* Attendance Compliance Report */}
        <div className="bg-white p-6 rounded-3xl border border-[#E5E9F7] shadow-soft flex flex-col justify-between hover:shadow-soft-lg transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#FEECEB] text-[#EF4444] flex items-center justify-center mb-4">
              <IconCalendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Floor Attendance Logs</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Optical turnstile check-in and check-out logs with exact timestamps, session durations, and credential verification mechanisms.
            </p>
            <div className="text-xs font-mono text-[#EF4444] mt-4 font-bold bg-[#FEECEB] px-3 py-1.5 rounded-lg inline-block">
              {attendanceLogs.length} Access Sessions Logged
            </div>
          </div>

          <button
            onClick={exportAttendanceCSV}
            className="mt-6 w-full py-2.5 bg-[#EF4444] hover:bg-red-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-soft transition-all"
          >
            <IconDownload className="w-4 h-4" />
            Export Attendance (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};
