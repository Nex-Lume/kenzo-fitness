import React from 'react';
import { useLocation } from 'react-router-dom';
import { FileText, Download, Building2, User, Calendar } from 'lucide-react';

const Invoice = () => {
  const location = useLocation();
  const { plan, paymentId } = location.state || {};

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Invoice</h1>
          <p className="text-xs text-zinc-500 mt-1">Download or print your payment receipt.</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          <Download className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white text-zinc-800 rounded-2xl p-8 shadow-2xl" id="invoice">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-zinc-200 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-600" />
              KenzoFitness
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Fitness & Wellness Center</p>
          </div>
          <div className="text-right">
            <div className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-2">
              PAID
            </div>
            <p className="text-sm font-semibold text-zinc-700 flex items-center gap-1 justify-end">
              <FileText className="w-4 h-4" />
              Invoice #{paymentId ? paymentId.slice(-8).toUpperCase() : 'N/A'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Date: {today}</p>
          </div>
        </div>

        {/* Plan Details */}
        <div className="border-b border-zinc-200 pb-6 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">Plan Details</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-100 rounded-xl">
                <th className="text-left p-3 rounded-l-xl text-zinc-600">Description</th>
                <th className="text-center p-3 text-zinc-600">Duration</th>
                <th className="text-right p-3 rounded-r-xl text-zinc-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3">
                  <div className="font-bold text-zinc-800">{plan?.name || 'Membership Plan'}</div>
                  <div className="text-xs text-zinc-500">Gym access and all included features</div>
                </td>
                <td className="p-3 text-center text-zinc-600">{plan?.durationInDays || '-'} days</td>
                <td className="p-3 text-right font-bold text-zinc-800">${plan?.price || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="w-48 space-y-2">
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Subtotal</span>
              <span>${plan?.price || '-'}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Tax</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-base font-black text-zinc-900 border-t border-zinc-200 pt-2">
              <span>Total</span>
              <span className="text-emerald-700">${plan?.price || '-'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400">
          <p>Thank you for choosing KenzoFitness! For any queries, contact <span className="font-semibold">support@kenzofitness.com</span></p>
          {paymentId && <p className="mt-1 font-mono text-zinc-300">Razorpay Transaction ID: {paymentId}</p>}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
