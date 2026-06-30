import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Dumbbell,
  Users,
  LayoutDashboard,
  LogOut,
  Home,
  Menu,
  X,
  CreditCard,
  UserCheck,
  Clock,
  Activity,
  CalendarCheck,
  Settings,
  FileText,
  PieChart,
  QrCode,
  DollarSign,
  Apple,
  TrendingUp
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
          { name: 'Members', path: '/admin/members', icon: Users },
          { name: 'Plans', path: '/admin/plans', icon: Dumbbell },
          { name: 'Trainers', path: '/admin/trainers', icon: Activity },
          { name: 'Bookings', path: '/admin/slots', icon: Clock },
          { name: 'Attendance', path: '/admin/attendance', icon: UserCheck },
          { name: 'Payments', path: '/admin/payments', icon: DollarSign },
          { name: 'Reports', path: '/admin/reports', icon: PieChart },
          { name: 'Messages', path: '/admin/messages', icon: CreditCard },
          { name: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'trainer':
        return [
          { name: 'Dashboard', path: '/trainer', icon: LayoutDashboard },
          { name: 'My Members', path: '/trainer/members', icon: Users },
          { name: 'Workout Plans', path: '/trainer/workout-plans', icon: Dumbbell },
          { name: 'Diet Plans', path: '/trainer/diet-plans', icon: Apple },
          { name: 'Body Progress', path: '/trainer/progress', icon: TrendingUp },
        ];
      case 'reception':
        return [
          { name: 'Dashboard', path: '/reception', icon: LayoutDashboard },
          { name: 'Scan QR', path: '/reception/scan', icon: QrCode },
          { name: 'Payments', path: '/reception/payments', icon: DollarSign },
        ];
      case 'member':
      default:
        return [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Book Slot', path: '/dashboard/book-slot', icon: Clock },
          { name: 'My Workouts', path: '/dashboard/workouts', icon: Dumbbell },
          { name: 'My Diets', path: '/dashboard/diets', icon: Apple },
          { name: 'Body Progress', path: '/dashboard/progress', icon: TrendingUp },
          { name: 'Attendance', path: '/dashboard/attendance', icon: CalendarCheck },
          { name: 'My Payments', path: '/dashboard/checkout', icon: DollarSign },
          { name: 'My Profile', path: '/dashboard/profile', icon: UserCheck },
        ];
    }
  };

  const links = getLinks();

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 font-sans overflow-hidden">
      {/* Mobile top navigation */}
      <div className="flex w-full items-center justify-between border-b border-indigo-950/40 bg-[#090d16]/90 backdrop-blur-md px-4 py-4 md:hidden absolute top-0 left-0 z-30 shadow-md">
        <Link to="/" className="flex items-center space-x-2 text-xl font-black tracking-wider text-violet-500">
          <Dumbbell className="h-6 w-6 text-emerald-400" />
          <span>KENZO<span className="text-white">FITNESS</span></span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#111827] hover:text-white"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar - Desktop and Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-indigo-950/40 bg-[#0c1122] p-5 transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static shadow-[4px_0_30px_rgba(0,0,0,0.3)]`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-between md:justify-start">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-wider text-violet-500">
            <Dumbbell className="h-7 w-7 text-emerald-400" />
            <span>KENZO<span className="text-white">FITNESS</span></span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:bg-[#111827] hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mb-6 rounded-xl bg-[#151c33]/50 border border-indigo-950/40 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 text-sm font-black text-white uppercase">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate text-sm font-bold text-white">{user?.name}</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-650 to-indigo-650 text-white shadow-lg shadow-violet-950/20 border-l-2 border-emerald-450 pl-3.5'
                    : 'text-slate-400 hover:bg-[#151c32] hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <hr className="border-indigo-950/40 my-4" />

          {/* Link back to Main Gym Website */}
          <Link
            to="/"
            className="flex items-center space-x-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-[#151c32] hover:text-white transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Gym Main Page</span>
          </Link>
        </nav>

        {/* Logout Button at bottom */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#090d16] px-4 py-20 md:py-8 md:px-10 mt-16 md:mt-0">
        <Outlet />
        {/* Bottom padding to prevent content cut-off */}
        <div className="h-12" />
      </div>
    </div>
  );
};

export default DashboardLayout;
