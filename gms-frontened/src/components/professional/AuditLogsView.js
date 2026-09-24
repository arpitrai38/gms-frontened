import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconSearch,
  IconDownload
} from '../common/Icons';

export const AuditLogsView = () => {
  const { auditLogs } = useGym();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const exportAuditLogs = () => {
    const json = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitFlow_Security_Audit_Trail_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight font-display">
            System Security & Audit Event Ledger
          </h2>
          <p className="text-xs text-slate-500">
            Immutable transaction logs, turnstile access timestamps, staff operations, and membership lifecycle changes.
          </p>
        </div>

        <button
          onClick={exportAuditLogs}
          className="px-4 py-2 bg-white hover:bg-fitflow-lilac text-slate-700 hover:text-fitflow-primary border border-[#E5E9F7] rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-soft transition-all"
        >
          <IconDownload className="w-4 h-4 text-fitflow-primary" />
          Export Audit Trail (JSON)
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E9F7] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAFF] border border-[#E5E9F7] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-fitflow-primary font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#F8FAFF] border border-[#E5E9F7] text-xs text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-fitflow-primary font-mono"
          >
            <option value="ALL">All Event Severities</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-[#E5E9F7] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8FAFF] border-b border-[#E5E9F7] text-slate-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Actor / Role</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F7] text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-sans">
                    No audit records matching search parameters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.actor}</div>
                      <div className="text-[10px] text-slate-400">{log.role}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-fitflow-primary">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-800">
                      {log.entity}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.severity === 'danger'
                          ? 'bg-[#FEECEB] text-[#EF4444]'
                          : log.severity === 'warning'
                          ? 'bg-[#FFFBEB] text-[#F59E0B]'
                          : log.severity === 'success'
                          ? 'bg-[#E8F8F0] text-[#10B981]'
                          : 'bg-[#EEF0FE] text-[#584CF4]'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
