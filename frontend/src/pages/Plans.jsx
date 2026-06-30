import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Dumbbell, ShieldCheck, HelpCircle } from 'lucide-react';

const FALLBACK_PLANS = [
  {
    _id: '1',
    name: 'Monthly Plan',
    price: 1500,
    durationInDays: 30,
    features: [
      'Access to gym floor & standard cardio machines',
      'Locker room & shower access',
      '1 Complimentary fitness assessment',
      'Free High-speed Wi-Fi',
    ],
  },
  {
    _id: '2',
    name: 'Quarterly Plan',
    price: 3500,
    durationInDays: 90,
    features: [
      'Access to gym floor & standard cardio machines',
      'Locker room, shower & sauna access',
      '3 Complimentary fitness assessments',
      '2 Personal training coaching sessions',
      '10% Discount on gym supplements & wear',
    ],
  },
  {
    _id: '3',
    name: 'Yearly Plan',
    price: 10000,
    durationInDays: 365,
    features: [
      '24/7 Access to gym floor & cardio machines',
      'Locker room, shower, sauna & steam room access',
      'Unlimited fitness assessments & body scans',
      '12 Personal training coaching sessions (1 per month)',
      'Custom diet & nutrition consultation plans',
      '20% Discount on gym supplements & wear',
      'Free guest pass (1 per month)',
    ],
  },
];

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        if (response.data.success && response.data.data.length > 0) {
          setPlans(response.data.data.filter(p => p.isActive));
        } else {
          setPlans(FALLBACK_PLANS);
        }
      } catch (err) {
        console.warn('Plans fetch failed, utilizing fallbacks:', err.message);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="bg-[#090d16] py-20 px-4 text-slate-100 relative">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]">PRICING PACKAGES</span>
          <h1 className="text-4xl font-extrabold text-white uppercase mt-6 mb-4 drop-shadow-lg">MEMBERSHIP TIERS</h1>
          <p className="mx-auto max-w-xl text-sm text-slate-400">
            Choose a gym membership that fits your athletic lifestyle. Join today and start tracking your metrics immediately.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-950/40 border-t-fuchsia-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => {
              const isYearly = plan.name.toLowerCase().includes('year');
              return (
                <div
                  key={plan._id}
                  className={`relative flex flex-col justify-between rounded-3xl border p-8 hover:-translate-y-2 transition-all duration-300 overflow-visible backdrop-blur-md ${
                    isYearly
                      ? 'border-fuchsia-500 bg-fuchsia-950/10 shadow-[0_0_30px_rgba(217,70,239,0.25)] hover:shadow-[0_0_45px_rgba(217,70,239,0.4)]'
                      : 'border-indigo-500/20 bg-[#0d1326]/60 hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]'
                  }`}
                >
                  {isYearly && (
                    <span className="absolute -top-4 right-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(217,70,239,0.6)] z-10">
                      Best Value
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-wider">{plan.name}</h3>
                    <div className="mt-6 flex items-baseline">
                      <span className={`text-5xl font-black tracking-tighter ${isYearly ? 'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]' : 'text-white'}`}>₹{plan.price}</span>
                      <span className="ml-2 text-sm text-slate-500 font-semibold uppercase tracking-widest">/ {plan.durationInDays} Days</span>
                    </div>

                    <hr className="border-indigo-500/20 my-6" />

                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-300 space-x-3">
                          <span className="text-emerald-400 font-bold mt-0.5 drop-shadow-md">&#10003;</span>
                          <span className="leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10">
                    <Link
                      to={`/admission?planId=${plan._id}`}
                      className={`block w-full text-center rounded-xl py-3.5 text-sm font-black uppercase tracking-widest transition-all text-white ${
                        isYearly
                          ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] hover:scale-105 active:scale-95'
                          : 'bg-[#151c32] hover:bg-violet-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 border border-indigo-500/20'
                      }`}
                    >
                      Join KenzoFitness
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Plan comparison notes / FAQ */}
        <div className="mt-28 border-t border-indigo-500/20 pt-16">
          <h2 className="text-xl font-black text-white uppercase text-center mb-10 drop-shadow-lg">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
            <div>
              <h4 className="flex items-start text-sm font-bold text-white space-x-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-fuchsia-400 mt-0.5" />
                <span>Can I upgrade or downgrade my plan?</span>
              </h4>
              <p className="text-xs text-slate-400 mt-2 pl-6 leading-relaxed">
                Yes, you can upgrade your plan at any time through our administration desk. Your existing credit will be calculated and applied pro-rata towards the new plan.
              </p>
            </div>
            <div>
              <h4 className="flex items-start text-sm font-bold text-white space-x-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-fuchsia-400 mt-0.5" />
                <span>What happens when my admission is pending?</span>
              </h4>
              <p className="text-xs text-slate-400 mt-2 pl-6 leading-relaxed">
                When you submit an admission request, your dashboard will show a "Pending" status. The gym administration will activate your account once payment and induction are verified.
              </p>
            </div>
            <div>
              <h4 className="flex items-start text-sm font-bold text-white space-x-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-fuchsia-400 mt-0.5" />
                <span>Is there an initiation fee?</span>
              </h4>
              <p className="text-xs text-slate-400 mt-2 pl-6 leading-relaxed">
                We believe in clean pricing. There are no initiation or sign-up fees. The price you see on the cards is exactly what you pay.
              </p>
            </div>
            <div>
              <h4 className="flex items-start text-sm font-bold text-white space-x-2">
                <HelpCircle className="h-4 w-4 shrink-0 text-fuchsia-400 mt-0.5" />
                <span>Do you offer personal coaching?</span>
              </h4>
              <p className="text-xs text-slate-400 mt-2 pl-6 leading-relaxed">
                Yes, our Quarterly and Yearly plans include complimentary coaching sessions. You can also book additional sessions with our trainers separately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
