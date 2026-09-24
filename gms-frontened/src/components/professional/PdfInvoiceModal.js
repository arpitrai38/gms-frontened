import React from 'react';
import { useGym } from '../../context/GymContext';
import {
  IconPrinter,
  IconX,
  IconFitFlowLogo
} from '../common/Icons';

export const PdfInvoiceModal = () => {
  const { activeInvoice, closeInvoice } = useGym();

  if (!activeInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-[#E5E9F7] rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between p-4 bg-[#F8FAFF] border-b border-[#E5E9F7] no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-fitflow-primary uppercase tracking-wider">
              Official Tax Invoice Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-fitflow-primary hover:bg-fitflow-primaryHover text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-glow-primary transition-all"
            >
              <IconPrinter className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={closeInvoice}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl bg-white border border-fitflow-border"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Printable Invoice Document */}
        <div id="printable-invoice" className="p-8 space-y-6 text-slate-700 bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#E5E9F7] pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <IconFitFlowLogo className="w-8 h-8" />
                <span className="font-display font-black text-xl tracking-tight text-slate-900">
                  Fit<span className="text-[#584CF4]">Flow</span>
                </span>
              </div>
              <div className="text-xs text-slate-500 leading-tight">
                FitFlow Performance Club & Training HQ<br />
                850 Iron Gym Boulevard, Suite 400<br />
                Austin, TX 78701 • Tax ID: TX-99201-GYM
              </div>
            </div>

            <div className="text-right">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase border ${
                activeInvoice.status === 'Paid'
                  ? 'bg-[#E8F8F0] text-[#10B981] border-[#10B981]/30'
                  : 'bg-[#FEECEB] text-[#EF4444] border-[#EF4444]/30'
              }`}>
                {activeInvoice.status}
              </span>
              <h2 className="text-xl font-black text-slate-900 font-mono mt-2">
                {activeInvoice.invoiceNumber}
              </h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Issued: {activeInvoice.date}
              </div>
            </div>
          </div>

          {/* Bill To Info */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">Billed To</div>
              <div className="font-bold text-slate-900 text-sm">{activeInvoice.memberName}</div>
              <div className="text-slate-600 mt-0.5">Plan: {activeInvoice.plan}</div>
              <div className="text-slate-400 font-mono">Payment Method: {activeInvoice.method}</div>
            </div>

            <div className="text-right">
              <div className="font-mono text-slate-400 uppercase text-[11px] mb-1">Facility Entitlements</div>
              <div className="text-slate-600">24/7 Floor Access & Classes</div>
              <div className="text-slate-600">Complimentary Locker & Shower</div>
              <div className="text-fitflow-primary font-mono text-[11px] mt-1 font-bold">Verified Member Status</div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#E5E9F7] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFF] text-slate-500 font-mono uppercase text-[10px] border-b border-[#E5E9F7]">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E9F7] text-slate-700">
                {(activeInvoice.items || [
                  { description: `${activeInvoice.plan} Membership Subscription`, qty: 1, rate: activeInvoice.amount, amount: activeInvoice.amount }
                ]).map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFF]">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.description}</td>
                    <td className="py-3 px-4 text-center font-mono">{item.qty}</td>
                    <td className="py-3 px-4 text-right font-mono">${item.rate.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">${item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal & Totals Breakdown */}
          <div className="flex justify-between items-end pt-2">
            {/* QR Stamp */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-fitflow-lilac/50 p-1.5 rounded-xl border border-fitflow-border flex items-center justify-center">
                <svg className="w-13 h-13" viewBox="0 0 100 100" fill="#584CF4">
                  <path d="M0 0h30v30H0zm5 5v20h20V5zm5 5h10v10H10zM70 0h30v30H70zm5 5v20h20V5zm5 5h10v10H80zM0 70h30v30H0zm5 5v20h20V75zm5 5h10v10H10zM40 10h10v20H40zm10 20h20v10H50zm-10 10h20v10H40zm30 10h10v10H70zm10 10h20v20H80zm-40 0h20v10H40zm10 20h20v10H50z" />
                </svg>
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                Official Digital Stamp<br />
                {activeInvoice.invoiceNumber}<br />
                Authorized by FitFlow Billing
              </div>
            </div>

            {/* Total Math */}
            <div className="w-56 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>${activeInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax / GST (9%):</span>
                <span>${activeInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-[#E5E9F7]">
                <span>Total Due:</span>
                <span className="text-[#584CF4]">${activeInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-[#E5E9F7] text-[11px] text-slate-400 text-center font-mono">
            Thank you for training with FitFlow Performance Club! Questions? billing@fitflow.com
          </div>
        </div>
      </div>
    </div>
  );
};
