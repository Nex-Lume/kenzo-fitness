import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Target, Plus, Trash2, Edit3, X, Activity } from 'lucide-react';

const TrainerGoals = () => {
  const [goals, setGoals] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [saving, setSaving] = useState(false);
  const isSaving = useRef(false);
  
  const [form, setForm] = useState({
    memberId: '',
    goalType: 'Weight Loss',
    targetWeight: '',
    progress: 0,
    deadline: '',
    status: 'In Progress'
  });

  useEffect(() => {
    fetchGoals();
    fetchMembers();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/goals');
      if (res.data.success) setGoals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const profileRes = await api.get('/trainers/me');
      setMembers(profileRes.data.data?.assignedMembers || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving.current) return;
    isSaving.current = true;
    setSaving(true);
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal._id}`, form);
      } else {
        await api.post('/goals', form);
      }
      setShowForm(false);
      setEditingGoal(null);
      resetForm();
      fetchGoals();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving goal');
    } finally {
      isSaving.current = false;
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this fitness goal?')) return;
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      alert('Error deleting goal');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setForm({
      memberId: goal.memberId?._id || goal.memberId || '',
      goalType: goal.goalType || 'Weight Loss',
      targetWeight: goal.targetWeight || '',
      progress: goal.progress || 0,
      deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
      status: goal.status || 'In Progress'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      memberId: '',
      goalType: 'Weight Loss',
      targetWeight: '',
      progress: 0,
      deadline: '',
      status: 'In Progress'
    });
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Goals...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Fitness Goals</h1>
          <p className="text-xs text-gray-500 mt-1">Assign and track fitness goals for your members.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingGoal(null); resetForm(); }}
          className="flex items-center gap-2 bg-[#c1ff00] text-black hover:from-[#c1ff00] hover:to-[#a4d500] px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">{editingGoal ? 'Edit Goal' : 'Assign New Goal'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Member *</label>
              <select required value={form.memberId} onChange={e => setForm({...form, memberId: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#c1ff00] outline-none">
                <option value="">Select Member</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.fullName || m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Goal Type *</label>
              <select required value={form.goalType} onChange={e => setForm({...form, goalType: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-[#c1ff00] outline-none">
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Fat Loss">Fat Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Strength">Strength</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Target Weight (kg)</label>
              <input type="number" step="0.1" value={form.targetWeight} onChange={e => setForm({...form, targetWeight: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#c1ff00]" placeholder="e.g. 75" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Progress (%)</label>
              <input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({...form, progress: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#c1ff00]" placeholder="0-100" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#c1ff00]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-[#c1ff00]">
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button disabled={saving} type="submit" className="bg-[#c1ff00] text-black px-8 py-3 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 transition-opacity">
              {saving ? 'Saving...' : editingGoal ? 'Update Goal' : 'Save Goal'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <div key={goal._id} className="bg-[#111827]/40 border border-white/10 rounded-3xl p-6 relative flex flex-col justify-between shadow-lg backdrop-blur-md group hover:bg-[#111827]/60 transition-all hover:-translate-y-1 hover:shadow-violet-900/20">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shrink-0">
                  <Target className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white truncate">{goal.goalType}</h3>
                  <p className="text-xs text-slate-400 truncate">For: {goal.memberId?.fullName || 'N/A'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(goal)} className="p-1.5 bg-indigo-500/10 text-[#c1ff00] hover:bg-indigo-500/20 hover:text-white rounded-lg transition-colors border border-indigo-500/20">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(goal._id)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20">
                  <Trash2 className="w-4 h-4" />
                </button>
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
              <div className="pt-2">
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
            <p className="text-sm text-gray-500">No fitness goals found. Assign one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerGoals;
