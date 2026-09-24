import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconPlus,
  IconSearch,
  IconCheck,
  IconPrinter,
  IconX
} from '../common/Icons';

export const PaymentManagement = ({ isRecordModalOpen, setIsRecordModalOpen }) => {
  const { payments, recordPayment, updatePaymentStatus, openInvoice, members } = useGym();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    memberId: members[0]?.id || '',
    memberName: members[0]?.name || '',
    plan: 'Gold Pro Athlete',
    amount: 139,
    method: 'Credit Card (Stripe)'
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMemberChange = (e) => {
    const selectedId = e.target.value;
    const member = members.find(m => m.id === selectedId);
    if (member) {
      setFormData({
        ...formData,
        memberId: member.id,
        memberName: member.name,
        plan: member.plan
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.memberName || !formData.amount) return;

    const newPayment = recordPayment({
      memberId: formData.memberId,
      memberName: formData.memberName,
      plan: formData.plan,
      amount: Number(formData.amount),
      method: formData.method
    });

    showToast(`Payment of $${newPayment.total} recorded!`);
    setIsRecordModalOpen(false);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.total, 0);
  const totalPending = payments.filter(p => p.status === 'Pending' || p.status === 'Overdue').reduce((sum, p) => sum + p.total, 0);

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
            Payments, Invoices & Billing
          </h2>
          <p className="text-xs text-[#64748B]">
            Subscription ledger, point-of-sale receipts, tax documentation, and printable PDF invoices.
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="px-4 py-2.5 bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-[0_4px_14px_rgba(88,76,244,0.35)] transition-all"
        >
          <IconPlus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* Revenue KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">Settled Revenue</span>
          <div className="text-2xl lg:text-3xl font-black text-[#111827] font-display mt-1">
            ${totalCollected.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#10B981] font-mono font-bold mt-1">Verified In Bank</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">Pending & Due</span>
          <div className="text-2xl lg:text-3xl font-black text-[#584CF4] font-display mt-1">
            ${totalPending.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-1">Awaiting Clearance</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5E9F7] shadow-[0_10px_30px_rgba(88,76,244,0.06)]">
          <span className="text-[11px] font-mono text-[#64748B] uppercase font-semibold">Total Invoices</span>
          <div className="text-2xl lg:text-3xl font-black text-[#111827] font-display mt-1">
            {payments.length}
          </div>
          <div className="text-[11px] text-[#64748B] font-mono mt-1">Digital Tax Records</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5E9F7] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <IconSearch className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number or athlete..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#584CF4]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F5F7FD] border border-[#E5E9F7] text-xs text-[#111827] font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-[#584CF4]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-[#E5E9F7] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FD] border-b border-[#E5E9F7] text-[#64748B] font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Athlete</th>
                <th className="py-3.5 px-4">Plan Item</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">PDF Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E9F7] text-[#334155]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#94A3B8]">
                    No transactions matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8FAFF] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#111827]">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#111827]">
                      {p.memberName}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">
                      {p.plan}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#584CF4] text-sm">
                      ${p.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px]">
                      {p.method}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#64748B]">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => {
                          const nextStatus = p.status === 'Paid' ? 'Pending' : p.status === 'Pending' ? 'Overdue' : 'Paid';
                          updatePaymentStatus(p.id, nextStatus);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono inline-block cursor-pointer transition-transform hover:scale-105 ${
                          p.status === 'Paid'
                            ? 'bg-[#E8F8F0] text-[#10B981]'
                            : p.status === 'Pending'
                            ? 'bg-[#EEF0FE] text-[#584CF4]'
                            : 'bg-[#FEECEB] text-[#EF4444]'
                        }`}
                      >
                        {p.status} ↺
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openInvoice(p)}
                        className="px-3 py-1.5 rounded-xl bg-[#EEF0FE] hover:bg-[#584CF4] hover:text-white text-[#584CF4] text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
                      >
                        <IconPrinter className="w-3.5 h-3.5" />
                        Print / PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#E5E9F7] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E9F7]">
              <h3 className="text-base font-bold text-[#111827] font-display">Record Member Payment</h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-[#94A3B8] hover:text-[#111827]">
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Select Athlete</label>
                <select
                  value={formData.memberId}
                  onChange={handleMemberChange}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.membershipId} - {m.plan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] font-mono text-sm focus:outline-none focus:border-[#584CF4]"
                />
              </div>

              <div>
                <label className="block text-[#64748B] font-mono uppercase mb-1">Payment Method</label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full bg-[#F5F7FD] border border-[#E5E9F7] rounded-xl px-3 py-2 text-[#111827] focus:outline-none focus:border-[#584CF4]"
                >
                  <option value="Credit Card (Stripe)">Credit Card (Stripe / POS)</option>
                  <option value="Cash Payment">Cash (Front Desk POS)</option>
                  <option value="UPI / Digital Wallet">UPI / Apple Pay / Google Pay</option>
                  <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E9F7]">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F7FD] hover:bg-[#E5E9F7] text-[#475569] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#584CF4] hover:bg-[#483BE0] text-white font-bold shadow-md"
                >
                  Generate Invoice & Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
