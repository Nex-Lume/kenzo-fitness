import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, FilePlus } from 'lucide-react';

const TrainerMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/trainers/me');
        if (response.data.success) {
          setMembers(response.data.data.assignedMembers || []);
        }
      } catch (error) {
        console.error('Failed to fetch trainer members', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading Members...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Assigned Members</h1>
        <p className="text-xs text-gray-500 mt-1">Manage workout and diet plans for your clients.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(m => (
          <div key={m._id} className="bg-[#111827]/40 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between shadow-lg backdrop-blur-md group hover:bg-[#111827]/60 transition-all hover:-translate-y-1 hover:shadow-violet-900/20">
            
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-[#c1ff00] font-black text-lg shrink-0">
                {m.fullName ? m.fullName.charAt(0).toUpperCase() : 'M'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-lg font-black text-white truncate">{m.fullName || m.name}</h3>
                <p className="text-xs text-slate-400 truncate">{m.email}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{m.phone || 'No Phone'}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-auto pt-4 border-t border-white/10">
              <button 
                onClick={() => window.location.href='/trainer/workout-plans'} 
                className="flex-1 bg-[#1a1a1a] border border-white/10 py-2.5 rounded-xl text-[10px] font-bold uppercase text-[#c1ff00] hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5 shadow-sm hover:border-[#c1ff00]/50"
              >
                <FilePlus className="w-3.5 h-3.5" /> Workouts
              </button>
              <button 
                onClick={() => window.location.href='/trainer/diet-plans'}
                className="flex-1 bg-[#1a1a1a] border border-white/10 py-2.5 rounded-xl text-[10px] font-bold uppercase text-emerald-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5 shadow-sm hover:border-emerald-400/50"
              >
                <FilePlus className="w-3.5 h-3.5" /> Diets
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="col-span-full text-center text-slate-500 py-16 border border-dashed border-white/10 rounded-3xl bg-[#111827]/20">
            <Users className="h-12 w-12 mx-auto text-slate-700 mb-4" />
            <p className="text-sm font-semibold">You currently have no members assigned.</p>
            <p className="text-xs mt-1">Contact an administrator to assign clients.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerMembers;
