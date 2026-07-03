import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Target, Activity } from 'lucide-react';

const MemberGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      // Find the member ID from the auth context or just call the appropriate endpoint
      // Assuming we have an endpoint to get member's own goals or we get all and filter
      // The backend should return only the member's goals for a member token if we hit /goals
      // Wait, let's just hit the endpoint for member. Since we might not have the ID directly in the payload, 
      // let's fetch profile first or hit a dedicated /my-goals route.
      // Actually, in the backend we have /api/goals/member/:memberId. But the member needs their ID.
      // Alternatively, the member's ID is in the user context, but it's a User ID, not Member ID.
      // Let's fetch /members/profile first to get the member ID.
      const profileRes = await api.get('/auth/me');
      if (profileRes.data.success) {
        const memberId = profileRes.data.member?._id;
        if (!memberId) return; // if not found
        const goalRes = await api.get(`/goals/member/${memberId}`);
        if (goalRes.data.success) {
          setGoals(goalRes.data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load goals', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Goals...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">My Fitness Goals</h1>
          <p className="text-xs text-gray-500 mt-1">Track the goals assigned by your trainer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal._id} className="bg-[#111827]/40 border border-white/10 rounded-3xl p-6 relative shadow-xl backdrop-blur-md group hover:-translate-y-1 hover:shadow-sky-900/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-sky-500/10 rounded-2xl group-hover:bg-sky-500/20 transition-colors"><Target className="w-5 h-5 text-sky-400" /></div>
              <div>
                <h3 className="text-sm font-bold text-white">{goal.goalType}</h3>
                <p className="text-[10px] font-semibold text-slate-400">Trainer: <span className="text-slate-300">{goal.trainerId?.fullName || 'N/A'}</span></p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Progress</span>
                  <span className="text-sky-400 font-black">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 pt-3 border-t border-white/10">
                <span>Target: <span className="text-white">{goal.targetWeight ? `${goal.targetWeight} kg` : 'N/A'}</span></span>
                <span>Due: <span className="text-white">{goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No date'}</span></span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className={`text-[10px] uppercase font-black tracking-wider px-3 py-1.5 rounded-lg border ${goal.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : goal.status === 'Failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}`}>
                  {goal.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-full text-center py-16 bg-[#111827]/20 border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
            <Activity className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-sm font-semibold text-slate-400">No active goals yet.</p>
            <p className="text-xs text-slate-500 mt-1">Discuss with your trainer to set some targets!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberGoals;
