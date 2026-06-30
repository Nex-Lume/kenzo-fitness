import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Menu, X, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-violet-600 selection:text-white">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 border-b border-indigo-950/40 bg-[#090d16]/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-wider text-violet-500 hover:opacity-90 transition-opacity">
            <Dumbbell className="h-7 w-7 text-emerald-400 animate-pulse" />
            <span>KENZO<span className="text-white">FITNESS</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link to="/" className="text-sm font-semibold transition-colors text-slate-300 hover:text-emerald-400">Home</Link>
            <Link to="/plans" className="text-sm font-semibold transition-colors text-slate-300 hover:text-emerald-400">Plans</Link>
            <Link to="/admission" className="text-sm font-semibold transition-colors text-slate-300 hover:text-emerald-400">Admission</Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/admission"
                  className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-violet-950/20 hover:shadow-[0_0_20px_rgba(109,40,217,0.45)] hover:scale-105 active:scale-95 transition-all"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white md:hidden focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-indigo-950/40 bg-[#090d16] px-4 py-4 md:hidden space-y-3 shadow-inner">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-350 hover:bg-slate-900 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/plans"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-350 hover:bg-slate-900 hover:text-white"
            >
              Plans
            </Link>
            <Link
              to="/admission"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-350 hover:bg-slate-900 hover:text-white"
            >
              Admission
            </Link>

            <hr className="border-indigo-950/40 my-2" />

            <div className="pt-2">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2.5 text-sm font-bold text-emerald-400"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 py-2.5 text-sm font-bold text-slate-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center rounded-lg py-2.5 text-sm font-bold text-slate-300 hover:bg-slate-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/admission"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-950/20"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-950/40 bg-[#0b101c] py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Info & Branding */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-wider text-violet-500">
                <Dumbbell className="h-6 w-6 text-emerald-400" />
                <span>KENZO<span className="text-white">FITNESS</span></span>
              </Link>
              <p className="text-xs leading-relaxed text-slate-500">
                KenzoFitness is a premium, results-oriented fitness center. We deliver top-tier equipment, personalized diet models, and elite trainers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Quick Links</h3>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home Page</Link></li>
                <li><Link to="/plans" className="hover:text-emerald-400 transition-colors">Membership Plans</Link></li>
                <li><Link to="/admission" className="hover:text-emerald-400 transition-colors">Admission Registration</Link></li>
                <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Client Login</Link></li>
              </ul>
            </div>

            {/* Timings */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Club Hours</h3>
              <ul className="space-y-2 text-xs">
                <li className="flex justify-between"><span>Monday - Friday:</span> <span className="text-slate-350">5:00 AM - 11:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday:</span> <span className="text-slate-350">6:00 AM - 9:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday:</span> <span className="text-emerald-400 font-semibold">8:00 AM - 6:00 PM</span></li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Contact Info</h3>
              <ul className="space-y-2 text-xs">
                <li>102 Iron Core Boulevard, Suite 500</li>
                <li>Miami, FL 33101</li>
                <li>Phone: <span className="text-slate-350">+91 98765 43210</span></li>
                <li>Email: <span className="text-violet-400 hover:underline">support@kenzofitness.com</span></li>
              </ul>
            </div>
          </div>

          <hr className="border-indigo-950/40 my-8" />

          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0 text-[11px] text-slate-600">
            <p>&copy; 2026 KenzoFitness. All rights reserved.</p>
            <p>Designed for premium wellness and athletic strength.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
