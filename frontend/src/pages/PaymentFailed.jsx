import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="max-w-lg mx-auto text-center space-y-8 py-10">
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-red-500/10 rounded-full animate-ping" />
        <div className="relative p-6 bg-red-500/20 rounded-full border-2 border-red-500/40">
          <XCircle className="w-16 h-16 text-red-400" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-black text-white">Payment Failed</h1>
        <p className="text-zinc-400 mt-2 text-sm">
          Something went wrong with your transaction. No amount has been deducted.
        </p>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 space-y-3 text-sm text-left">
        <h3 className="text-zinc-300 font-bold">Possible reasons:</h3>
        <ul className="space-y-2 text-zinc-500 list-disc list-inside">
          <li>Insufficient balance in your account</li>
          <li>Payment was cancelled by you</li>
          <li>Bank declined the transaction</li>
          <li>Network timeout during payment</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/dashboard/checkout"
          className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-bold px-6 py-3 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-6 py-3 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
