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
      const profileRes = await api.get('/members/profile');
      if (profileRes.data.success) {
        const memberId = profileRes.data.data._id;
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
          <div key={goal._id} className="bg-[#111111]/30 border border-white/10 rounded-2xl p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#c1ff00]/10 rounded-xl"><Target className="w-5 h-5 text-[#c1ff00]" /></div>
              <div>
                <h3 className="text-sm font-bold text-white">{goal.goalType}</h3>
                <p className="text-[10px] text-gray-400">Trainer: {goal.trainerId?.fullName || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-[#c1ff00] font-bold">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c1ff00]" style={{ width: `${goal.progress}%` }}></div>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5">
                <span>Target: {goal.targetWeight ? `${goal.targetWeight} kg` : 'N/A'}</span>
                <span>Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No date'}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${goal.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : goal.status === 'Failed' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {goal.status}
                </span>
              </div>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <Activity className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No active goals yet. Discuss with your trainer to set some targets!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberGoals;
