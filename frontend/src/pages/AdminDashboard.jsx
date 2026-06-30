import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Users,
  Activity,
  UserPlus,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  Calendar,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [expiryStats, setExpiryStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const [statsRes, expiryRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/expiry')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (expiryRes.data.success) {
        setExpiryStats(expiryRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleApprove = async (memberId) => {
    if (window.confirm('Are you sure you want to approve this admission request and mark it as active/paid?')) {
      setActionLoading(true);
      try {
        await api.put(`/members/${memberId}`, {
          status: 'active',
          paymentStatus: 'paid',
        });
        // Reload dashboard statistics
        await fetchStats();
      } catch (err) {
        alert(err.response?.data?.message || 'Approval failed.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center text-red-400 max-w-xl mx-auto mt-10">
        <AlertCircle className="h-10 w-10 mx-auto mb-4" />
        <h3 className="text-base font-bold text-zinc-200 mb-2">Metrics Fetch Failed</h3>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  // Dashboard Stats card layout configuration
  const cardConfig = [
    { title: 'Total Members', value: stats?.totalMembers || 0, icon: Users, desc: 'Registered accounts', color: 'text-zinc-100', bg: 'bg-zinc-900/40' },
    { title: 'Active Members', value: stats?.activeMembers || 0, icon: Activity, desc: 'Active subscriptions', color: 'text-emerald-400', bg: 'bg-emerald-500/5' },
    { title: 'Today\'s Bookings', value: stats?.todayBookings || 0, icon: Calendar, desc: 'Slots reserved', color: 'text-orange-400', bg: 'bg-orange-500/5' },
    { title: 'Today\'s Attendance', value: stats?.todayAttendance || 0, icon: ShieldCheck, desc: 'Checked-in members', color: 'text-amber-400', bg: 'bg-amber-500/5' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Overview</h1>
          <p className="text-xs text-zinc-500 mt-1">KenzoFitness metrics and business summary dashboard.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/attendance"
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-300 transition-colors"
          >
            <span>Attendance Log</span>
          </Link>
          <Link
            to="/admin/members"
            className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-xs font-bold text-zinc-950 transition-colors"
          >
            <span>Manage Members</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cardConfig.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`rounded-2xl border border-zinc-900 p-6 ${card.bg} flex justify-between items-start`}>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{card.title}</span>
                <h3 className={`text-3xl font-black tracking-tight ${card.color}`}>{card.value}</h3>
                <span className="text-[10px] text-zinc-500 block">{card.desc}</span>
              </div>
              <div className="rounded-xl bg-zinc-950 p-2.5 border border-zinc-900">
                <Icon className="h-5 w-5 text-zinc-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Admissions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <h3 className="text-base font-bold text-zinc-200 flex items-center space-x-2">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-400" />
              <span>Recent Admissions Requests</span>
            </h3>
          </div>

          {stats?.recentAdmissions?.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No recent admission requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {stats?.recentAdmissions?.map((member) => (
                    <tr key={member._id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-4 pr-4 font-semibold text-zinc-200">{member.fullName}</td>
                      <td className="py-4 px-4 font-medium text-orange-400">
                        {member.membershipPlan?.name || 'N/A'}
                      </td>
                      <td className="py-4 pl-4 text-right">
                        {member.status === 'pending' ? (
                          <button
                            disabled={actionLoading}
                            onClick={() => handleApprove(member._id)}
                            className="inline-flex items-center space-x-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 px-2.5 py-1 text-[10px] font-black text-zinc-950 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-zinc-600 font-semibold flex items-center justify-end space-x-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500/60" />
                            <span>Approved</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Expiring Members Panel */}
        <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
            <h3 className="text-base font-bold text-zinc-200 flex items-center space-x-2">
              <AlertCircle className="h-4.5 w-4.5 text-red-400" />
              <span>Expiring Memberships (&lt;30 days)</span>
            </h3>
          </div>

          {!expiryStats || expiryStats.allExpiring.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No members are expiring soon.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {expiryStats.allExpiring.slice(0, 5).map((member) => {
                    const days = Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <tr key={member._id} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="py-4 pr-4 font-semibold text-zinc-200">
                          {member.fullName}
                          <span className="block text-[10px] text-zinc-500 mt-0.5">{member.phone}</span>
                        </td>
                        <td className="py-4 px-4 font-medium text-orange-400">
                          {member.membershipPlan?.name || 'N/A'}
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {days < 0 ? (
                            <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-full">Expired</span>
                          ) : (
                            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">In {days} days</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
