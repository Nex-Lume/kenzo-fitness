import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, ShieldAlert, KeyRound, Mail } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const data = await login(formData.email, formData.password);
      if (data.success) {
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#0a0a0a] px-4 py-12">
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#c1ff00]/5 via-transparent to-transparent"></div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#111827]/40 p-8 shadow-xl backdrop-blur-md">
        {/* Branding header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-950/30 text-[#c1ff00] mb-4 border border-violet-850/20">
            <Dumbbell className="h-6 w-6 text-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to manage your workouts or member stats</p>
        </div>

        {/* Error Alert Box */}
        {formError && (
          <div className="mb-6 flex items-start space-x-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <KeyRound className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#c1ff00] text-black py-3.5 text-xs font-bold text-white shadow-md shadow-violet-950/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[11px] text-slate-500">
            Don't have an admission yet?{' '}
            <Link to="/admission" className="text-emerald-450 font-bold hover:underline hover:text-emerald-350">
              Submit Admission Request
            </Link>
          </p>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#1a1a1a]/40 p-4 text-[10px] text-slate-400 leading-relaxed space-y-1">
          <span className="font-bold text-white uppercase tracking-wider block mb-1">Demo Credentials:</span>
          <div>Admin: <span className="text-emerald-400 font-semibold">admin@kenzofitness.com</span> / <span className="text-slate-300 font-mono">admin123</span></div>
          <div>Demo Member: <span className="text-[#c1ff00] font-semibold">member@kenzofitness.com</span> / <span className="text-slate-300 font-mono">member123</span></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
