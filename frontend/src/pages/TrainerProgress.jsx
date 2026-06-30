import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { TrendingUp, Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';

const TrainerProgress = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [form, setForm] = useState({
    weight: '',
    height: '',
    bmi: '',
    bodyFat: '',
    chest: '',
    waist: '',
    arms: '',
    thighs: '',
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
    setForm({ weight: '', height: '', bmi: '', bodyFat: '', chest: '', waist: '', arms: '', thighs: '', notes: '' });
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
          <p className="text-xs text-zinc-500 mt-1">Track and monitor your members' physical progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none">
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
        <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
          <TrendingUp className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">No members assigned. Ask admin to assign members to you.</p>
        </div>
      )}

      {/* Form */}
      {showForm && selectedMember && (
        <form onSubmit={handleSubmit} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">Log Progress for <span className="text-cyan-400">{selectedMemberName}</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Weight (kg)</label>
              <input value={form.weight} onChange={(e) => handleWeightChange(e.target.value)} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" placeholder="75" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Height (cm)</label>
              <input value={form.height} onChange={(e) => handleHeightChange(e.target.value)} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" placeholder="175" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">BMI (auto)</label>
              <input value={form.bmi} readOnly
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-cyan-400 font-bold outline-none cursor-not-allowed" placeholder="—" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Body Fat %</label>
              <input value={form.bodyFat} onChange={(e) => setForm({ ...form, bodyFat: e.target.value })} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" placeholder="18" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Chest (cm)</label>
              <input value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Waist (cm)</label>
              <input value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Arms (cm)</label>
              <input value={form.arms} onChange={(e) => setForm({ ...form, arms: e.target.value })} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Thighs (cm)</label>
              <input value={form.thighs} onChange={(e) => setForm({ ...form, thighs: e.target.value })} type="number" step="0.1"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none" placeholder="Any observations..." />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg">
              Log Progress
            </button>
          </div>
        </form>
      )}

      {/* Progress History */}
      {selectedMember && progressData.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-zinc-100">Progress History — <span className="text-cyan-400">{selectedMemberName}</span></h2>
          {progressData.slice().reverse().map((entry) => (
            <div key={entry._id} className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-900/50 transition-colors"
                onClick={() => setExpandedEntry(expandedEntry === entry._id ? null : entry._id)}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-cyan-500/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Weight: <span className="text-white font-medium">{entry.weight || '—'} kg</span>
                      {entry.bmi && <> · BMI: <span className="text-cyan-400 font-medium">{entry.bmi}</span></>}
                      {entry.bodyFat && <> · Body Fat: <span className="text-amber-400 font-medium">{entry.bodyFat}%</span></>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(entry._id); }} className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  {expandedEntry === entry._id ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </div>
              </div>
              {expandedEntry === entry._id && (
                <div className="border-t border-zinc-800 px-5 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Weight', val: entry.weight, unit: 'kg' },
                      { label: 'Height', val: entry.height, unit: 'cm' },
                      { label: 'BMI', val: entry.bmi, unit: '' },
                      { label: 'Body Fat', val: entry.bodyFat, unit: '%' },
                      { label: 'Chest', val: entry.chest, unit: 'cm' },
                      { label: 'Waist', val: entry.waist, unit: 'cm' },
                      { label: 'Arms', val: entry.arms, unit: 'cm' },
                      { label: 'Thighs', val: entry.thighs, unit: 'cm' },
                    ].map((m, i) => (
                      <div key={i} className="bg-zinc-950 border border-zinc-800/50 rounded-lg p-3 text-center">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">{m.label}</p>
                        <p className="text-lg font-black text-white mt-1">{m.val || '—'}<span className="text-zinc-600 text-xs ml-0.5">{m.unit}</span></p>
                      </div>
                    ))}
                  </div>
                  {entry.notes && (
                    <div className="mt-3 bg-zinc-950 border border-zinc-800/50 rounded-lg p-3">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Notes</p>
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
        <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-2xl">
          <TrendingUp className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-500 text-sm">No progress entries for this member yet.</p>
        </div>
      )}
    </div>
  );
};

export default TrainerProgress;
