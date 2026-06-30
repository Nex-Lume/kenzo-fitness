import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CreditCard, ShieldCheck, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const MemberCheckout = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        if (response.data.success) {
          setPlans(response.data.data);
          if (response.data.data.length > 0) {
            setSelectedPlan(response.data.data[0]);
          }
        }
      } catch (err) {
        setError('Failed to load membership plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) return;
    setProcessing(true);
    setError(null);

    try {
      // Step 1: Create Razorpay order on backend
      const orderRes = await api.post('/payment/create-order', {
        planId: selectedPlan._id,
        amount: selectedPlan.price
      });

      const { order, key, paymentRecordId } = orderRes.data;

      // Step 2: Open Razorpay checkout
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'KenzoFitness',
        description: `${selectedPlan.name} Membership`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment on backend
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: selectedPlan._id,
              local_payment_id: paymentRecordId
            });

            if (verifyRes.data.success) {
              navigate('/dashboard/payment-success', { state: { plan: selectedPlan, paymentId: response.razorpay_payment_id } });
            } else {
              navigate('/dashboard/payment-failed');
            }
          } catch {
            navigate('/dashboard/payment-failed');
          }
        },
        prefill: {},
        theme: { color: '#10b981' },
        modal: {
          ondismiss: () => setProcessing(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => navigate('/dashboard/payment-failed'));
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || 'Could not initiate payment. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-zinc-400 text-sm animate-pulse">Loading plans...</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Membership Checkout</h1>
        <p className="text-xs text-zinc-500 mt-1">Secure payments powered by Razorpay.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plan Selector */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase text-zinc-400 tracking-wider">Select a Plan</h2>
          {plans.map(plan => (
            <button
              key={plan._id}
              onClick={() => setSelectedPlan(plan)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                selectedPlan?._id === plan._id
                  ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{plan.durationInDays} days access</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(plan.features || []).slice(0, 2).map((f, i) => (
                      <span key={i} className="flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="text-3xl font-black text-emerald-400">₹{plan.price}</span>
                  <span className="text-xs text-zinc-500 block">/ {plan.durationInDays}d</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 sticky top-6">
            <h2 className="text-sm font-bold uppercase text-zinc-400 tracking-wider mb-6">Order Summary</h2>
            {selectedPlan ? (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Plan</span>
                  <span className="text-white font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Duration</span>
                  <span className="text-white font-semibold">{selectedPlan.durationInDays} days</span>
                </div>
                <div className="border-t border-zinc-800 pt-4 flex justify-between">
                  <span className="text-zinc-300 font-bold">Total</span>
                  <span className="text-emerald-400 text-xl font-black">${selectedPlan.price}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No plan selected.</p>
            )}

            <button
              onClick={handlePayment}
              disabled={!selectedPlan || processing}
              className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              {processing ? (
                <span className="animate-pulse">Initiating Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ${selectedPlan?.price || 0} Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-zinc-600 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>256-bit SSL encrypted payment</span>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-zinc-600 text-xs">
              <CreditCard className="w-3 h-3" />
              <span>Cards, UPI, Net Banking, Wallets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCheckout;
