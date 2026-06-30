import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Dumbbell, ShieldAlert, User, Mail, Phone, Home, Shield, Sparkles } from 'lucide-react';

const FALLBACK_PLANS = [
  { _id: '1', name: 'Monthly Plan', price: 49 },
  { _id: '2', name: 'Quarterly Plan', price: 129 },
  { _id: '3', name: 'Yearly Plan', price: 399 },
];

const Register = () => {
  const { registerMember, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPlanId = searchParams.get('planId') || '';

  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    age: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    membershipPlan: initialPlanId,
  });

  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // Load plans for selection
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/plans');
        if (response.data.success && response.data.data.length > 0) {
          setPlans(response.data.data.filter(p => p.isActive));
          // If we had no plan selected and plans returned, select the first plan by default
          if (!formData.membershipPlan) {
            setFormData(prev => ({ ...prev, membershipPlan: response.data.data[0]._id }));
          }
        } else {
          setPlans(FALLBACK_PLANS);
          if (!formData.membershipPlan) {
            setFormData(prev => ({ ...prev, membershipPlan: FALLBACK_PLANS[0]._id }));
          }
        }
      } catch (err) {
        console.warn('Could not load active plans, using fallbacks:', err.message);
        setPlans(FALLBACK_PLANS);
        if (!formData.membershipPlan) {
          setFormData(prev => ({ ...prev, membershipPlan: FALLBACK_PLANS[0]._id }));
        }
      }
    };

    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    if (!formData.membershipPlan) {
      setFormError('Please select a membership plan.');
      setLoading(false);
      return;
    }

    try {
      const response = await registerMember({
        ...formData,
        age: parseInt(formData.age, 10),
      });

      if (response.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="relative z-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-150 mb-3">
            <Sparkles className="h-3 w-3 animate-spin" />
            <span>Admission Request</span>
          </span>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Join KenzoFitness Today</h2>
          <p className="text-xs text-slate-500 mt-1">Submit your details below to activate your fitness membership</p>
        </div>

        {/* Error alert */}
        {formError && (
          <div className="mb-6 flex items-start space-x-2 rounded-xl bg-red-50 border border-red-250 p-4 text-xs text-red-700">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">Account Profile</h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Account Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Choose login password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 border-b border-slate-200 pt-4 pb-2">Physical details</h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Age */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Age</label>
              <input
                type="number"
                required
                min={12}
                max={100}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="25"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Residential Address</label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-slate-400">
                <Home className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Fitness Ave, Apt 4B, Iron City"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Emergency Contact */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Emergency Contact (Name & Phone)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Shield className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="Jane Doe (+1 555-018-9988)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-450 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Membership Plan selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Membership Plan</label>
              <select
                value={formData.membershipPlan}
                onChange={(e) => setFormData({ ...formData, membershipPlan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="" disabled>-- Choose a Plan --</option>
                {plans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} - ₹{plan.price}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-4 text-xs font-bold text-white shadow-md shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] transition-all disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? 'Submitting Request...' : 'Submit Admission Request'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[11px] text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline hover:text-indigo-850">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default Register;
