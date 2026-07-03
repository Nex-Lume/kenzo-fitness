import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const { plan, paymentId } = location.state || {};

  return (
    <div className="max-w-lg mx-auto text-center space-y-8 py-10">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-emerald-500/10 rounded-full animate-ping" />
        <div className="relative p-6 bg-emerald-500/20 rounded-full border-2 border-emerald-500/40">
          <CheckCircle className="w-16 h-16 text-emerald-400" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-black text-white">Payment Successful!</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Your {plan?.name || 'membership'} plan is now active. Get ready to crush your goals!
        </p>
      </div>

      <div className="bg-[#111111]/30 border border-white/10 rounded-2xl p-6 text-left space-y-4">
        {plan && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="text-white font-semibold">{plan.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="text-white font-semibold">{plan.durationInDays} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-emerald-400 font-bold">₹{plan.price}</span>
            </div>
          </>
        )}
        {paymentId && (
          <div className="flex justify-between text-sm border-t border-white/10 pt-4">
            <span className="text-gray-500">Transaction ID</span>
            <span className="text-zinc-300 font-mono text-xs">{paymentId}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold px-6 py-3 rounded-xl transition-all"
        >
          Go to Dashboard <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/dashboard/invoice"
          state={{ plan, paymentId }}
          className="flex items-center justify-center gap-2 bg-white/5 hover:bg-zinc-700 text-zinc-300 font-bold px-6 py-3 rounded-xl transition-all"
        >
          <Download className="w-4 h-4" /> Download Invoice
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
