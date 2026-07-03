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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(m => (
          <div key={m._id} className="bg-[#111111]/30 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white">{m.fullName || m.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{m.email}</p>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-zinc-950 border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase text-[#c1ff00] hover:bg-white/5 transition-colors flex items-center justify-center gap-1">
                  <FilePlus className="w-3 h-3" /> Workout
                </button>
                <button className="flex-1 bg-zinc-950 border border-white/10 py-2 rounded-lg text-[10px] font-bold uppercase text-emerald-400 hover:bg-white/5 transition-colors flex items-center justify-center gap-1">
                  <FilePlus className="w-3 h-3" /> Diet
                </button>
              </div>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10 border border-dashed border-white/10 rounded-2xl">
            You currently have no members assigned. Contact an administrator to assign clients.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerMembers;
