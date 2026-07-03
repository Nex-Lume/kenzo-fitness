import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Dumbbell, Activity, ChevronDown, ChevronUp } from 'lucide-react';

const MemberWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlan, setExpandedPlan] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Get member's own profile to find memberId
        const memberRes = await api.get('/auth/me');
        const memberId = memberRes.data.member?._id;
        if (memberId) {
          const response = await api.get(`/workouts/member/${memberId}`);
          if (response.data.success) {
            setWorkouts(response.data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch workouts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  const levelColors = {
    beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    intermediate: 'text-[#c1ff00] bg-amber-500/10 border-amber-500/20',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10',
    completed: 'text-blue-400 bg-blue-500/10',
    paused: 'text-[#c1ff00] bg-amber-500/10',
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Workouts...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">My Workouts</h1>
        <p className="text-xs text-gray-500 mt-1">View your active workout plans assigned by your trainer.</p>
      </div>

      <div className="space-y-4">
        {workouts.map(plan => (
          <div key={plan._id} className="bg-[#111827]/40 border border-white/10 rounded-3xl overflow-hidden shadow-lg backdrop-blur-md group hover:bg-[#111827]/60 transition-all hover:-translate-y-0.5 hover:shadow-violet-900/20">
            <div className="p-6 flex justify-between items-center cursor-pointer transition-colors"
              onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-[#c1ff00]/10 rounded-xl">
                  <Dumbbell className="w-5 h-5 text-[#c1ff00]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{plan.planName}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Trainer: <span className="text-zinc-300">{plan.trainerId?.fullName || 'N/A'}</span>
                    {plan.duration && <> · <span className="text-[#c1ff00]">{plan.duration}</span></>}
                    {plan.goal && <> · Goal: <span className="text-zinc-300">{plan.goal}</span></>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${levelColors[plan.level] || 'text-gray-400 bg-white/5 border-zinc-700'}`}>
                  {plan.level || 'N/A'}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[plan.status] || 'text-gray-400 bg-white/5'}`}>
                  {plan.status}
                </span>
                {expandedPlan === plan._id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </div>
            </div>
            {expandedPlan === plan._id && plan.exercises?.length > 0 && (
              <div className="border-t border-white/10 px-5 py-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="pb-3 pr-4">Exercise</th>
                      <th className="pb-3 pr-4">Body Part</th>
                      <th className="pb-3 pr-4">Equipment</th>
                      <th className="pb-3 pr-4 text-center">Sets</th>
                      <th className="pb-3 pr-4 text-center">Reps</th>
                      <th className="pb-3 pr-4 text-center">Weight</th>
                      <th className="pb-3 pr-4 text-center">Rest</th>
                      <th className="pb-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {plan.exercises.map((ex, i) => (
                      <tr key={i} className="text-zinc-300">
                        <td className="py-4 pr-4 font-bold text-white">{ex.exerciseName}</td>
                        <td className="py-4 pr-4">{ex.bodyPart || '-'}</td>
                        <td className="py-4 pr-4">{ex.equipment || '-'}</td>
                        <td className="py-4 pr-4 text-center">{ex.sets}</td>
                        <td className="py-4 pr-4 text-center">{ex.reps}</td>
                        <td className="py-4 pr-4 text-center">{ex.weight || '-'}</td>
                        <td className="py-4 pr-4 text-center">{ex.rest || '-'}</td>
                        <td className="py-4 text-gray-500 text-xs">{ex.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        {workouts.length === 0 && (
          <div className="text-center py-16 bg-[#111827]/20 border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
            <Dumbbell className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-semibold">No workout plans assigned yet.</p>
            <p className="text-slate-500 text-xs mt-1">Your trainer will assign them soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberWorkouts;
