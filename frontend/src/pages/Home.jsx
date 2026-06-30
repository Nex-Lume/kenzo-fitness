import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Dumbbell,
  ShieldCheck,
  Award,
  Users2,
  Calendar,
  ChevronRight,
  Flame,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

const FALLBACK_PLANS = [
  {
    _id: '1',
    name: 'Monthly Plan',
    price: 49,
    durationInDays: 30,
    features: ['Access to gym floor & standard cardio machines', 'Locker room & shower access', '1 Complimentary fitness assessment'],
  },
  {
    _id: '2',
    name: 'Quarterly Plan',
    price: 129,
    durationInDays: 90,
    features: ['Access to gym floor & standard cardio machines', 'Locker room, shower & sauna access', '3 Complimentary fitness assessments', '2 Personal training coaching sessions'],
  },
  {
    _id: '3',
    name: 'Yearly Plan',
    price: 399,
    durationInDays: 365,
    features: ['24/7 Access to gym floor', 'Locker room, shower, sauna & steam access', 'Unlimited fitness assessments', '12 Personal coaching sessions', 'Custom diet & nutrition plans'],
  },
];

const Home = () => {
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        if (response.data.success && response.data.data.length > 0) {
          // Filter only active plans
          setPlans(response.data.data.filter(p => p.isActive));
        } else {
          setPlans(FALLBACK_PLANS);
        }
      } catch (err) {
        console.warn('Could not load dynamic plans, using static fallbacks:', err.message);
        setPlans(FALLBACK_PLANS);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simulate contact form submission
    setFormSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="relative overflow-hidden bg-[#090d16] text-slate-100">
      {/* 1. Hero Section */}
      <section className="relative flex min-h-[95vh] items-center justify-center bg-[#090d16] px-4 py-20 overflow-hidden">
        {/* Cyberpunk Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/images/cyberpunk_gym_hero.png')" }}
        ></div>
        
        {/* Background Gradients & Overlays */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#090d16]/80 via-[#090d16]/60 to-[#090d16]"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-emerald-500/20 blur-[150px] z-0 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[150px] z-0 animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-violet-950/40 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-400 border border-violet-800/30 mb-6">
            <Flame className="h-3.5 w-3.5" />
            <span>FUEL YOUR FIT JOURNEY</span>
          </span>

          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-8xl drop-shadow-2xl uppercase">
            SHAPE YOUR BODY <br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-2 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-emerald-400 opacity-40 blur-xl animate-pulse"></span>
              <span className="relative bg-gradient-to-r from-violet-400 via-fuchsia-300 to-emerald-300 bg-clip-text text-transparent">
                BUILD YOUR LEGACY
              </span>
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg font-medium drop-shadow-md">
            Elite coaching, state-of-the-art conditioning space, and customized dietary designs to fuel your maximum capacity. Join the community pushing limits daily.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              to="/admission"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_40px_rgba(217,70,239,0.8)] hover:scale-105 active:scale-95 transition-all text-center relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started Today</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            </Link>
            <Link
              to="/plans"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-full border border-violet-500/30 bg-black/50 backdrop-blur-md px-10 py-4 text-sm font-black uppercase tracking-widest text-slate-200 hover:bg-violet-900/30 hover:border-violet-400/60 hover:text-white transition-all text-center shadow-lg"
            >
              <span>Explore Plans</span>
              <ChevronRight className="h-4 w-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Intro & Why Choose Us Section */}
      <section className="border-t border-indigo-950/40 bg-[#0b101c] py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Title / Description */}
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                WELCOME TO <span className="text-violet-500">KENZOFITNESS</span> FITNESS
              </h2>
              <p className="text-sm leading-relaxed text-slate-450">
                At KenzoFitness, we believe physical training is the ultimate engine for mental focus and personal growth. Our premium facility bridges core athletic strength setups with clean recovery services to accommodate your wellness goals.
              </p>
              <p className="text-sm leading-relaxed text-slate-450">
                Whether your target is bodybuilding, functional mobility, athletic conditioning, or basic weight management, our custom metrics structure keeps you focused and accountable.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 border border-emerald-550/20">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Elite Certification</h4>
                    <p className="text-xs text-slate-500 mt-1">Trainers certified in functional safety and high-level prep.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400 border border-violet-550/20">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Premium Equipment</h4>
                    <p className="text-xs text-slate-500 mt-1">Elite machines from Hammer Strength and Life Fitness.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Badges Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/10 to-emerald-600/10 blur-2xl z-0 rounded-full"></div>
              
              <div className="relative z-10 rounded-2xl border border-indigo-500/20 bg-[#0d1326]/80 p-6 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all backdrop-blur-xl">
                <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/30">
                  <Users2 className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Engaged Community</h3>
                <p className="text-xs leading-relaxed text-slate-400">Join a motivating group of enthusiasts pushing boundaries everyday.</p>
              </div>
              
              <div className="relative z-10 rounded-2xl border border-indigo-500/20 bg-[#0d1326]/80 p-6 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:-translate-y-1 transition-all backdrop-blur-xl">
                <div className="bg-violet-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-violet-500/30">
                  <Calendar className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Flexible Hours</h3>
                <p className="text-xs leading-relaxed text-slate-400">With early mornings and late nights, fit training perfectly into your schedule.</p>
              </div>
              
              <div className="relative z-10 rounded-2xl border border-indigo-500/20 bg-[#0d1326]/80 p-6 hover:border-fuchsia-500/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] hover:-translate-y-1 transition-all backdrop-blur-xl">
                <div className="bg-fuchsia-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-fuchsia-500/30">
                  <Dumbbell className="h-6 w-6 text-fuchsia-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Custom Nutrition</h3>
                <p className="text-xs leading-relaxed text-slate-400">Integrated plan choices with premium options supporting meal models.</p>
              </div>
              
              <div className="relative z-10 rounded-2xl border border-indigo-500/20 bg-[#0d1326]/80 p-6 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-1 transition-all backdrop-blur-xl">
                <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-amber-500/30">
                  <Flame className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">Sauna Recovery</h3>
                <p className="text-xs leading-relaxed text-slate-400">Access dry steam saunas for muscle recovery and relaxation post-workout.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Facilities Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090d16] relative">
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <span className="text-xs font-black uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]">AMENITIES</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-6 mb-4 drop-shadow-lg">OUR STATE-OF-THE-ART FACILITIES</h2>
          <p className="mx-auto max-w-xl text-sm text-slate-400 mb-16">
            We offer specialized zones designed to host custom training modes, helping you maximize performance.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Strength Training', icon: Dumbbell, desc: 'Complete range of free weights, squat racks, and specialized resistance machines.', accent: 'violet' },
              { title: 'Cardio Suite', icon: Flame, desc: 'Advanced treadmills, ellipticals, stairmasters, and rowing machines with telemetry.', accent: 'emerald' },
              { title: 'Group Fitness Studio', icon: Users2, desc: 'Spacious flooring dedicated to Yoga, HIIT, Pilates, and functional spin courses.', accent: 'fuchsia' },
              { title: 'Dry Sauna & Baths', icon: ShieldCheck, desc: 'Clean, heated dry saunas and lockers for maximum recovery and relaxation.', accent: 'amber' }
            ].map((fac, i) => {
              const borderColors = {
                violet: 'hover:border-violet-500/50 border-t-violet-500',
                emerald: 'hover:border-emerald-500/50 border-t-emerald-500',
                fuchsia: 'hover:border-fuchsia-500/50 border-t-fuchsia-500',
                amber: 'hover:border-amber-500/50 border-t-amber-500'
              };
              const bgHoverColors = {
                violet: 'group-hover:bg-violet-500/10 group-hover:text-violet-400',
                emerald: 'group-hover:bg-emerald-500/10 group-hover:text-emerald-400',
                fuchsia: 'group-hover:bg-fuchsia-500/10 group-hover:text-fuchsia-400',
                amber: 'group-hover:bg-amber-500/10 group-hover:text-amber-400'
              };
              const shadowColors = {
                violet: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
                emerald: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
                fuchsia: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.15)]',
                amber: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
              };

              return (
                <div
                  key={i}
                  className={`group rounded-2xl border border-indigo-950/40 bg-[#0d1326]/60 p-6 text-left ${borderColors[fac.accent]} ${shadowColors[fac.accent]} hover:-translate-y-1 transition-all duration-300 shadow-lg border-t-2 backdrop-blur-sm`}
                >
                  <div className={`mb-5 inline-flex rounded-xl bg-[#151c32] p-3 text-slate-400 ${bgHoverColors[fac.accent]} transition-colors`}>
                    <fac.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{fac.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-400">{fac.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Membership Plans Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0b101c] relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <span className="text-xs font-black uppercase tracking-wider text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 rounded-full border border-fuchsia-500/20 shadow-[0_0_10px_rgba(217,70,239,0.2)]">PRICING TIERS</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-6 mb-4 drop-shadow-lg">MEMBERSHIP PLANS</h2>
          <p className="mx-auto max-w-xl text-sm text-slate-400 mb-16">
            Pick a tier that fits your dedication. No hidden fees, clear durations, and premium access.
          </p>

          {loadingPlans ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-950/40 border-t-fuchsia-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {plans.map((plan) => {
                const isYearly = plan.name.toLowerCase().includes('year');
                return (
                  <div
                    key={plan._id}
                    className={`relative flex flex-col justify-between rounded-3xl border p-8 text-left hover:-translate-y-2 transition-all duration-300 backdrop-blur-md ${
                      isYearly
                        ? 'border-fuchsia-500 bg-fuchsia-950/10 shadow-[0_0_30px_rgba(217,70,239,0.25)] hover:shadow-[0_0_45px_rgba(217,70,239,0.4)]'
                        : 'border-indigo-500/20 bg-[#0d1326]/60 hover:border-violet-500/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]'
                    }`}
                  >
                    {isYearly && (
                      <span className="absolute -top-4 right-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(217,70,239,0.6)]">
                        Best Value
                      </span>
                    )}
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-wider">{plan.name}</h3>
                      <div className="mt-6 flex items-baseline">
                        <span className={`text-5xl font-black tracking-tighter ${isYearly ? 'text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)]' : 'text-white'}`}>₹{plan.price}</span>
                        <span className="ml-2 text-sm text-slate-500 font-semibold uppercase tracking-widest">/ {plan.durationInDays} Days</span>
                      </div>
                      <ul className="mt-8 space-y-4">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-300 space-x-3">
                            <span className="text-emerald-400 font-bold mt-0.5 shadow-emerald-400/50 drop-shadow-md">&#10003;</span>
                            <span className="leading-relaxed">{feat}</span>
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
                        Choose Plan
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-16">
            <Link to="/plans" className="inline-flex items-center text-sm font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] transition-all space-x-2">
              <span>Compare plan features</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trainers Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090d16]">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-black uppercase tracking-wider text-violet-550">COACHING STAFF</span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-2 mb-4">TRAIN WITH THE BEST</h2>
          <p className="mx-auto max-w-xl text-xs text-slate-450 mb-16">
            Our trainers are dedicated specialists focused on functional anatomy, corrective mobility, and peak athletic programming.
          </p>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Marcus Vance', role: 'Strength & Bodybuilding Coach', credentials: 'CSCS Certified, 8+ Years Experience', color: 'from-violet-900/10 to-indigo-900/2', image: '/images/trainer_marcus.png' },
              { name: 'Sarah Jenkins', role: 'Corrective Exercise Specialist', credentials: 'B.S. Kinesiology, NASM-CES', color: 'from-emerald-900/10 to-teal-900/2', image: '/images/trainer_sarah.png' },
              { name: 'David Miller', role: 'Athletic Performance Specialist', credentials: 'Former D1 Conditioning Coach', color: 'from-violet-900/10 to-indigo-900/2', image: '/images/trainer_david.png' },
            ].map((coach, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-indigo-950/40 bg-[#111827]/40 p-6 text-left hover:border-violet-500/40 transition-all hover:bg-[#111827]/60 shadow-lg"
              >
                {/* Photo Placeholder -> Actual Image */}
                <div className={`mb-5 aspect-square w-full rounded-xl bg-gradient-to-tr ${coach.color} border border-indigo-950/40 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all relative`}>
                  <img src={coach.image} alt={coach.name} className="w-full h-full object-cover rounded-xl z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent z-20 opacity-80"></div>
                </div>
                <h3 className="text-xl font-bold text-white">{coach.name}</h3>
                <span className="text-xs font-bold text-violet-400 mt-1 block tracking-wider uppercase">{coach.role}</span>
                <p className="text-xs text-slate-500 mt-2">{coach.credentials}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Contact Section */}
      <section className="relative bg-[#090d16] py-24 px-4 sm:px-6 lg:px-8 border-t border-indigo-500/20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px] z-0"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Details & Info */}
            <div className="space-y-10">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">GET IN TOUCH</span>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mt-6 mb-4 drop-shadow-lg">WE WOULD LOVE TO HEAR FROM YOU</h2>
                <p className="text-sm leading-relaxed text-slate-400 max-w-md">
                  Have questions about our facility rates, corporate memberships, or training schedule? Leave a message or drop by for a tour.
                </p>
              </div>

              <div className="space-y-6 text-sm font-semibold text-slate-300">
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="rounded-xl bg-[#0d1326] p-3 border border-indigo-500/20 text-violet-400 group-hover:bg-violet-500/20 group-hover:border-violet-500/40 group-hover:text-violet-300 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="group-hover:text-violet-300 transition-colors">+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="rounded-xl bg-[#0d1326] p-3 border border-indigo-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:text-emerald-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="group-hover:text-emerald-300 transition-colors">support@kenzofitness.com</span>
                </div>
                <div className="flex items-center space-x-4 group cursor-pointer">
                  <div className="rounded-xl bg-[#0d1326] p-3 border border-indigo-500/20 text-fuchsia-400 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/40 group-hover:text-fuchsia-300 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.3)] transition-all">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="group-hover:text-fuchsia-300 transition-colors">102 Iron Core Boulevard, Suite 500, Miami, FL 33101</span>
                </div>
              </div>

              {/* Enhanced Map Placeholder */}
              <div className="rounded-2xl border border-indigo-500/30 bg-[#0d1326]/60 p-4 h-56 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden shadow-lg group backdrop-blur-sm cursor-pointer">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-600/10 via-[#0d1326]/80 to-[#0d1326] group-hover:from-violet-600/20 transition-all duration-500"></div>
                
                {/* Decorative Map Grid lines */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <MapPin className="h-10 w-10 text-violet-500 mb-3 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-black tracking-widest uppercase z-10 text-white drop-shadow-md">View on Map</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 z-10">Interactive Map Integration</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-indigo-500/20 bg-[#0d1326]/60 p-8 md:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-fuchsia-600"></div>
              
              <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-wide">Send Us A Message</h3>
              
              {formSubmitted ? (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Transmission Received!</p>
                  <p className="text-emerald-500/70 text-xs mt-2 font-medium">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-indigo-500/20 bg-[#060910] px-5 py-4 text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-indigo-500/20 bg-[#060910] px-5 py-4 text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30 transition-all shadow-inner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Message</label>
                    <textarea
                      required
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl border border-indigo-500/20 bg-[#060910] px-5 py-4 text-sm font-semibold text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 transition-all resize-none shadow-inner"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] active:scale-95 hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
