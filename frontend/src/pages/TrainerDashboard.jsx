import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Calendar, Activity, Dumbbell, ChevronRight, Apple, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [dietCount, setDietCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, workoutRes, dietRes, progressRes] = await Promise.all([
          api.get('/trainers/me'),
          api.get('/workout-plans').catch(() => ({ data: { data: [] } })),
          api.get('/diet-plans').catch(() => ({ data: { data: [] } })),
          api.get('/progress').catch(() => ({ data: { data: [] } })),
        ]);
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
        }
        setWorkoutCount(workoutRes.data?.data?.length || 0);
        setDietCount(dietRes.data?.data?.length || 0);
        setProgressCount(progressRes.data?.data?.length || 0);
      } catch (error) {
        console.error('Failed to fetch trainer data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Dashboard...</div>;

  const assignedMembers = profile?.assignedMembers || [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Trainer Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">Welcome back, Coach {user?.name}.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-orange-500 rounded-xl text-zinc-950">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#c1ff00] font-bold uppercase tracking-wider">Assigned Members</p>
            <h3 className="text-2xl font-black text-white mt-1">{assignedMembers.length}</h3>
          </div>
        </div>

        <div className="bg-[#c1ff00]/10 border border-[#c1ff00]/20 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-violet-500 rounded-xl text-white">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#c1ff00] font-bold uppercase tracking-wider">Workout Plans</p>
            <h3 className="text-2xl font-black text-white mt-1">{workoutCount}</h3>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500 rounded-xl text-zinc-950">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Diet Plans</p>
            <h3 className="text-2xl font-black text-white mt-1">{dietCount}</h3>
          </div>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-cyan-500 rounded-xl text-zinc-950">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Progress Logs</p>
            <h3 className="text-2xl font-black text-white mt-1">{progressCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111111]/30 border border-zinc-900 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              Your Clients
            </h2>
            <Link to="/trainer/members" className="text-xs text-[#c1ff00] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {assignedMembers.slice(0, 5).map(m => (
              <div key={m._id} className="flex justify-between items-center bg-zinc-950 border border-white/10 p-4 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold text-white">{m.fullName || m.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {m.status === 'active' ? (
                      <span className="text-emerald-400">● Active</span>
                    ) : (
                      <span className="text-red-400">● Inactive</span>
                    )}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-white p-2">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {assignedMembers.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">No members assigned yet.</p>
            )}
          </div>
        </div>

        <div className="bg-[#111111]/30 border border-zinc-900 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#c1ff00]" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/trainer/workout-plans" className="bg-zinc-950 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors text-center group">
              <Dumbbell className="w-8 h-8 text-gray-500 group-hover:text-[#c1ff00] mx-auto mb-2 transition-colors" />
              <span className="text-xs font-bold text-zinc-300 block">Workout Plans</span>
            </Link>
            <Link to="/trainer/diet-plans" className="bg-zinc-950 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors text-center group">
              <Apple className="w-8 h-8 text-gray-500 group-hover:text-emerald-500 mx-auto mb-2 transition-colors" />
              <span className="text-xs font-bold text-zinc-300 block">Diet Plans</span>
            </Link>
            <Link to="/trainer/progress" className="bg-zinc-950 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors text-center group">
              <TrendingUp className="w-8 h-8 text-gray-500 group-hover:text-cyan-500 mx-auto mb-2 transition-colors" />
              <span className="text-xs font-bold text-zinc-300 block">Body Progress</span>
            </Link>
            <Link to="/trainer/members" className="bg-zinc-950 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors text-center group">
              <Users className="w-8 h-8 text-gray-500 group-hover:text-[#c1ff00] mx-auto mb-2 transition-colors" />
              <span className="text-xs font-bold text-zinc-300 block">My Members</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
