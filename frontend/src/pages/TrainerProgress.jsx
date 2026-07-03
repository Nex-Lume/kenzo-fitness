import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { TrendingUp, Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

const TrainerProgress = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const isSaving = useRef(false);
  const [form, setForm] = useState({
    weight: '',
    height: '',
    bmi: '',
    bodyFat: '',
    chest: '',
    waist: '',
    hip: '',
    shoulders: '',
    biceps: '',
    forearms: '',
    thighs: '',
    calves: '',
    neck: '',
    notes: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) {
      fetchProgress(selectedMember);
    }
  }, [selectedMember]);

  const fetchMembers = async () => {
    try {
      const profileRes = await api.get('/trainers/me');
      const assigned = profileRes.data.data?.assignedMembers || [];
      setMembers(assigned);
      if (assigned.length > 0) {
        setSelectedMember(assigned[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (memberId) => {
    try {
      const res = await api.get(`/progress/member/${memberId}`);
      setProgressData(res.data.data || []);
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
      await api.post('/progress', {
        memberId: selectedMember,
        ...form
      });
      setShowForm(false);
      resetForm();
      fetchProgress(selectedMember);
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging progress');
    } finally {
      isSaving.current = false;
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this progress entry?')) return;
    try {
      await api.delete(`/progress/${id}`);
      fetchProgress(selectedMember);
    } catch (err) {
      alert('Error deleting entry');
    }
  };

  const resetForm = () => {
    setForm({ weight: '', height: '', bmi: '', bodyFat: '', chest: '', waist: '', hip: '', shoulders: '', biceps: '', forearms: '', thighs: '', calves: '', neck: '', notes: '' });
  };

  // Auto-calculate BMI
  const calcBMI = (w, h) => {
    if (w && h) {
      const heightInM = h / 100;
      return (w / (heightInM * heightInM)).toFixed(1);
    }
    return '';
  };

  const handleWeightChange = (val) => {
    const bmi = calcBMI(parseFloat(val), parseFloat(form.height));
    setForm({ ...form, weight: val, bmi });
  };

  const handleHeightChange = (val) => {
    const bmi = calcBMI(parseFloat(form.weight), parseFloat(val));
    setForm({ ...form, height: val, bmi });
  };

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;

  const selectedMemberName = members.find(m => m._id === selectedMember)?.fullName || 'Select a member';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Body Progress</h1>
          <p className="text-xs text-gray-500 mt-1">Track and monitor your members' physical progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}
            className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none">
            {members.map(m => <option key={m._id} value={m._id}>{m.fullName || m.name}</option>)}
          </select>
          <button
            onClick={() => { setShowForm(!showForm); resetForm(); }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-950/30"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Log Progress'}
          </button>
        </div>
      </div>

      {members.length === 0 && (
        <div className="text-center py-16 bg-[#111111]/30 border border-white/10 rounded-2xl">
          <TrendingUp className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No members assigned. Ask admin to assign members to you.</p>
        </div>
      )}

      {/* Form */}
      {showForm && selectedMember && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-xl p-8 space-y-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Log Progress for <span className="text-cyan-400">{selectedMemberName}</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Weight (kg)</label>
              <input value={form.weight} onChange={(e) => handleWeightChange(e.target.value)} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="75" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Height (cm)</label>
              <input value={form.height} onChange={(e) => handleHeightChange(e.target.value)} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="175" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">BMI (auto)</label>
              <input value={form.bmi} readOnly
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-xs text-cyan-400 font-bold outline-none cursor-not-allowed" placeholder="—" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Body Fat %</label>
              <input value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" placeholder="18" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Chest (cm)</label>
              <input value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Waist (cm)</label>
              <input value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Hip (cm)</label>
              <input value={form.hip} onChange={(e) => setForm({ ...form, hip: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Shoulders (cm)</label>
              <input value={form.shoulders} onChange={(e) => setForm({ ...form, shoulders: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Biceps (cm)</label>
              <input value={form.biceps} onChange={(e) => setForm({ ...form, biceps: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Forearms (cm)</label>
              <input value={form.forearms} onChange={(e) => setForm({ ...form, forearms: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Thighs (cm)</label>
              <input value={form.thighs} onChange={(e) => setForm({ ...form, thighs: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Calves (cm)</label>
              <input value={form.calves} onChange={(e) => setForm({ ...form, calves: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Neck (cm)</label>
              <input value={form.neck} onChange={(e) => setForm({ ...form, neck: e.target.value })} type="number" step="0.1"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
            </div>
          </div>
          <div className="pt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-cyan-500 outline-none resize-none transition-all" placeholder="Any observations..." />
          </div>
          <div className="flex justify-end pt-4 border-t border-white/10">
            <button disabled={saving} type="submit" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-10 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] disabled:opacity-50">
              {saving ? 'Saving...' : 'Log Progress'}
            </button>
          </div>
        </form>
      )}

      {/* Progress History */}
      {selectedMember && progressData.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Progress History — <span className="text-cyan-400">{selectedMemberName}</span></h2>
          {progressData.slice().reverse().map((entry) => (
            <div key={entry._id} className="bg-[#111827]/40 border border-white/10 rounded-3xl overflow-hidden shadow-lg backdrop-blur-md group hover:bg-[#111827]/60 transition-all hover:-translate-y-0.5 hover:shadow-cyan-900/20">
              <div className="p-6 flex justify-between items-center cursor-pointer transition-colors"
                onClick={() => setExpandedEntry(expandedEntry === entry._id ? null : entry._id)}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Weight: <span className="text-white font-medium">{entry.weight || '—'} kg</span>
                      {entry.bmi && <> · BMI: <span className="text-cyan-400 font-medium">{entry.bmi}</span></>}
                      {entry.bodyFat && <> · Body Fat: <span className="text-[#c1ff00] font-medium">{entry.bodyFat}%</span></>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(entry._id); }} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  {expandedEntry === entry._id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                </div>
              </div>
              {expandedEntry === entry._id && (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Weight', val: entry.weight, unit: 'kg' },
                      { label: 'Height', val: entry.height, unit: 'cm' },
                      { label: 'BMI', val: entry.bmi, unit: '' },
                      { label: 'Body Fat', val: entry.bodyFat, unit: '%' },
                      { label: 'Chest', val: entry.chest, unit: 'cm' },
                      { label: 'Waist', val: entry.waist, unit: 'cm' },
                      { label: 'Hip', val: entry.hip, unit: 'cm' },
                      { label: 'Shoulders', val: entry.shoulders, unit: 'cm' },
                      { label: 'Biceps', val: entry.biceps, unit: 'cm' },
                      { label: 'Forearms', val: entry.forearms, unit: 'cm' },
                      { label: 'Thighs', val: entry.thighs, unit: 'cm' },
                      { label: 'Calves', val: entry.calves, unit: 'cm' },
                      { label: 'Neck', val: entry.neck, unit: 'cm' },
                    ].map((m, i) => (
                      <div key={i} className="bg-zinc-950 border border-white/10 rounded-lg p-3 text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{m.label}</p>
                        <p className="text-lg font-black text-white mt-1">{m.val || '—'}<span className="text-zinc-600 text-xs ml-0.5">{m.unit}</span></p>
                      </div>
                    ))}
                  </div>
                  {entry.notes && (
                    <div className="mt-3 bg-zinc-950 border border-white/10 rounded-lg p-3">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Notes</p>
                      <p className="text-xs text-zinc-300">{entry.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedMember && progressData.length === 0 && !loading && (
        <div className="text-center py-16 bg-[#111827]/20 border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
          <TrendingUp className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-semibold">No progress entries for this member yet.</p>
          <p className="text-slate-500 text-xs mt-1">Click "Log Progress" to add their first check-in.</p>
        </div>
      )}
    </div>
  );
};

export default TrainerProgress;
