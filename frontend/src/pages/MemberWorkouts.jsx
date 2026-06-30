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
        const memberRes = await api.get('/members/me');
        const memberId = memberRes.data.data?._id;
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
    intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10',
    completed: 'text-blue-400 bg-blue-500/10',
    paused: 'text-amber-400 bg-amber-500/10',
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Workouts...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">My Workouts</h1>
        <p className="text-xs text-zinc-500 mt-1">View your active workout plans assigned by your trainer.</p>
      </div>

      <div className="space-y-4">
        {workouts.map(plan => (
          <div key={plan._id} className="bg-zinc-900/30 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-900/50 transition-colors"
              onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-violet-500/10 rounded-xl">
                  <Dumbbell className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{plan.planName}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Trainer: <span className="text-zinc-300">{plan.trainerId?.fullName || 'N/A'}</span>
                    {plan.goal && <> · Goal: <span className="text-zinc-300">{plan.goal}</span></>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${levelColors[plan.level] || 'text-zinc-400 bg-zinc-800 border-zinc-700'}`}>
                  {plan.level || 'N/A'}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[plan.status] || 'text-zinc-400 bg-zinc-800'}`}>
                  {plan.status}
                </span>
                {expandedPlan === plan._id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </div>
            </div>
            {expandedPlan === plan._id && plan.exercises?.length > 0 && (
              <div className="border-t border-zinc-800 p-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-zinc-500 uppercase border-b border-zinc-800">
                    <tr>
                      <th className="pb-3 pr-4 font-semibold">Exercise</th>
                      <th className="pb-3 pr-4 font-semibold">Muscle</th>
                      <th className="pb-3 pr-4 font-semibold text-center">Sets</th>
                      <th className="pb-3 pr-4 font-semibold text-center">Reps</th>
                      <th className="pb-3 pr-4 font-semibold text-center">Weight</th>
                      <th className="pb-3 pr-4 font-semibold text-center">Rest</th>
                      <th className="pb-3 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {plan.exercises.map((ex, i) => (
                      <tr key={i} className="text-zinc-300">
                        <td className="py-4 pr-4 font-bold text-white">{ex.exerciseName}</td>
                        <td className="py-4 pr-4">{ex.muscleGroup || '-'}</td>
                        <td className="py-4 pr-4 text-center">{ex.sets}</td>
                        <td className="py-4 pr-4 text-center">{ex.reps}</td>
                        <td className="py-4 pr-4 text-center">{ex.weight || '-'}</td>
                        <td className="py-4 pr-4 text-center">{ex.restTime || '-'}</td>
                        <td className="py-4 text-zinc-500 text-xs">{ex.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
        {workouts.length === 0 && (
          <div className="text-center text-zinc-500 py-16 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
            <Dumbbell className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p>You don't have any workout plans assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberWorkouts;
