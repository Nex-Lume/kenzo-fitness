import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Dumbbell, Plus, Trash2, Edit3, X, ChevronDown, ChevronUp } from 'lucide-react';

const TrainerWorkouts = () => {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [form, setForm] = useState({
    memberId: '',
    planName: '',
    goal: '',
    level: 'beginner',
    duration: '',
    startDate: '',
    endDate: '',
    exercises: [{ exerciseName: '', bodyPart: '', equipment: '', sets: '', reps: '', weight: '', rest: '', notes: '' }],
    status: 'active'
  });

  useEffect(() => {
    fetchPlans();
    fetchMembers();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/workouts');
      setPlans(res.data.data || []);
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
    try {
      if (editingPlan) {
        await api.put(`/workouts/${editingPlan._id}`, form);
      } else {
        await api.post('/workouts', form);
      }
      setShowForm(false);
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving workout plan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this workout plan?')) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchPlans();
    } catch (err) {
      alert('Error deleting plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      memberId: plan.memberId?._id || plan.memberId || '',
      planName: plan.planName || '',
      goal: plan.goal || '',
      level: plan.level || 'beginner',
      duration: plan.duration || '',
      startDate: plan.startDate ? plan.startDate.split('T')[0] : '',
      endDate: plan.endDate ? plan.endDate.split('T')[0] : '',
      exercises: plan.exercises?.length ? plan.exercises : [{ exerciseName: '', bodyPart: '', equipment: '', sets: '', reps: '', weight: '', rest: '', notes: '' }],
      status: plan.status || 'active'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      memberId: '',
      planName: '',
      goal: '',
      level: 'beginner',
      duration: '',
      startDate: '',
      endDate: '',
      exercises: [{ exerciseName: '', bodyPart: '', equipment: '', sets: '', reps: '', weight: '', rest: '', notes: '' }],
      status: 'active'
    });
  };

  const addExercise = () => {
    setForm({ ...form, exercises: [...form.exercises, { exerciseName: '', muscleGroup: '', sets: '', reps: '', weight: '', restTime: '', notes: '' }] });
  };

  const removeExercise = (idx) => {
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) });
  };

  const updateExercise = (idx, field, value) => {
    const updated = [...form.exercises];
    updated[idx][field] = value;
    setForm({ ...form, exercises: updated });
  };

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

  if (loading) return <div className="text-white text-center mt-20">Loading Workout Plans...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Workout Plans</h1>
          <p className="text-xs text-gray-500 mt-1">Create and manage workout plans for your members.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingPlan(null); resetForm(); }}
          className="flex items-center gap-2 bg-[#c1ff00] text-black hover:from-[#c1ff00] hover:to-[#a4d500] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-950/30"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Plan'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">{editingPlan ? 'Edit Workout Plan' : 'Create Workout Plan'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Member *</label>
              <select value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                <option value="">Select Member</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.fullName || m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Plan Name *</label>
              <input value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="e.g. Upper Body Strength" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Goal</label>
              <input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="e.g. Build muscle" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Level</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Duration</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" placeholder="e.g. 12 weeks" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none" />
            </div>
          </div>

          {/* Exercises */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Exercises</label>
              <button type="button" onClick={addExercise} className="text-xs text-[#c1ff00] hover:text-violet-300 font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Exercise</button>
            </div>
            <div className="space-y-3">
              {form.exercises.map((ex, idx) => (
                <div key={idx} className="bg-zinc-950 border border-white/10 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 relative">
                  <input value={ex.exerciseName} onChange={(e) => updateExercise(idx, 'exerciseName', e.target.value)} placeholder="Exercise Name"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.bodyPart} onChange={(e) => updateExercise(idx, 'bodyPart', e.target.value)} placeholder="Body Part"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.equipment} onChange={(e) => updateExercise(idx, 'equipment', e.target.value)} placeholder="Equipment"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.sets} onChange={(e) => updateExercise(idx, 'sets', e.target.value)} placeholder="Sets" type="number"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.reps} onChange={(e) => updateExercise(idx, 'reps', e.target.value)} placeholder="Reps" type="number"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.weight} onChange={(e) => updateExercise(idx, 'weight', e.target.value)} placeholder="Weight"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.rest} onChange={(e) => updateExercise(idx, 'rest', e.target.value)} placeholder="Rest Time"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  <input value={ex.notes} onChange={(e) => updateExercise(idx, 'notes', e.target.value)} placeholder="Notes" className="col-span-2 md:col-span-1 bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-violet-500" />
                  {form.exercises.length > 1 && (
                    <button type="button" onClick={() => removeExercise(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-[#c1ff00] text-black hover:from-[#c1ff00] hover:to-[#a4d500] text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg">
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-16 bg-[#111111]/30 border border-white/10 rounded-2xl">
            <Dumbbell className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No workout plans created yet.</p>
          </div>
        ) : (
          plans.map(plan => (
            <div key={plan._id} className="bg-[#111111]/30 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-[#c1ff00]/10 rounded-xl">
                    <Dumbbell className="w-5 h-5 text-[#c1ff00]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{plan.planName}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      For: <span className="text-zinc-300">{plan.memberId?.fullName || 'N/A'}</span>
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
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(plan); }} className="p-1.5 text-gray-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(plan._id); }} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  {expandedPlan === plan._id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </div>
              {expandedPlan === plan._id && plan.exercises?.length > 0 && (
                <div className="border-t border-white/10 px-5 py-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-gray-500 uppercase tracking-wider">
                        <th className="text-left py-2">Exercise</th>
                        <th className="text-left py-2">Body Part</th>
                        <th className="text-left py-2">Equipment</th>
                        <th className="text-center py-2">Sets</th>
                        <th className="text-center py-2">Reps</th>
                        <th className="text-center py-2">Weight</th>
                        <th className="text-center py-2">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.exercises.map((ex, i) => (
                        <tr key={i} className="border-t border-white/10 text-zinc-300">
                          <td className="py-2.5 font-medium text-white">{ex.exerciseName}</td>
                          <td className="py-2.5">{ex.bodyPart}</td>
                          <td className="py-2.5">{ex.equipment}</td>
                          <td className="py-2.5 text-center">{ex.sets}</td>
                          <td className="py-2.5 text-center">{ex.reps}</td>
                          <td className="py-2.5 text-center">{ex.weight}</td>
                          <td className="py-2.5 text-center">{ex.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerWorkouts;
