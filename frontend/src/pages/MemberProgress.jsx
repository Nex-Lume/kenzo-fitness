import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Target, Upload, TrendingUp, Activity, Ruler } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MemberProgress = () => {
  const [history, setHistory] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New entry form state
  const [showLogModal, setShowLogModal] = useState(false);
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
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progRes, goalRes] = await Promise.all([
        api.get('/progress'),
        api.get('/progress/goals')
      ]);
      if (progRes.data.success) setHistory(progRes.data.data);
      if (goalRes.data.success) setGoals(goalRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result); // Base64
      };
      reader.readAsDataURL(file);
    }
  };

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

  const submitLog = async (e) => {
    e.preventDefault();
    if (isSaving.current) return;
    isSaving.current = true;
    setSaving(true);
    try {
      await api.post('/progress', {
        ...form,
        progressPhotos: photoPreview ? [photoPreview] : []
      });
      setShowLogModal(false);
      setForm({ weight: '', height: '', bmi: '', bodyFat: '', chest: '', waist: '', hip: '', shoulders: '', biceps: '', forearms: '', thighs: '', calves: '', neck: '', notes: '' });
      setPhotoPreview('');
      fetchData(); // refresh
    } catch (err) {
      alert('Failed to log progress');
    } finally {
      isSaving.current = false;
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Progress...</div>;

  const chartData = {
    labels: history.map(h => new Date(h.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: history.map(h => h.weight),
        borderColor: 'rgb(14, 165, 233)', // sky blue
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Body Progress</h1>
          <p className="text-xs text-gray-500 mt-1">Track your fitness journey and achieve your goals.</p>
        </div>
        <button 
          onClick={() => setShowLogModal(true)}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg shadow-sky-900/20 transition-all active:scale-[0.98]"
        >
          Log Progress
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goals & Current Stats */}
        <div className="space-y-6">
          <div className="bg-[#111827]/40 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Target className="w-32 h-32 text-sky-500" />
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-8 relative z-10 uppercase tracking-tight">
              <Target className="w-5 h-5 text-sky-500" /> Current Goals
            </h2>
            <div className="relative z-10">
              {goals.slice(0,2).map(goal => (
              <div key={goal._id} className="mb-4 last:mb-0">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-zinc-300">{goal.type}</span>
                  <span className="text-sky-400 font-bold">{goal.progressPercentage}%</span>
                </div>
                <div className="h-2 bg-zinc-950 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 rounded-full" style={{ width: `${goal.progressPercentage}%` }}></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-right">Target Weight: {goal.targetWeight} kg</p>
              </div>
            ))}
            </div>
            {goals.length === 0 && <p className="text-sm font-semibold text-slate-400">No active goals.</p>}
          </div>

          <div className="bg-[#111827]/40 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Activity className="w-32 h-32 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-8 relative z-10 uppercase tracking-tight">
              <Activity className="w-5 h-5 text-emerald-500" /> Latest Log
            </h2>
            <div className="relative z-10">
              {history.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-center shadow-inner">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Weight</span>
                  <span className="text-2xl font-black text-white">{history[history.length-1].weight} kg</span>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-center shadow-inner">
                    <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">BMI</span>
                    <span className="text-2xl font-black text-sky-400">{history[history.length-1].bmi || '-'}</span>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-center shadow-inner">
                    <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Body Fat</span>
                    <span className="text-2xl font-black text-white">{history[history.length-1].bodyFat || '-'}%</span>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-center shadow-inner">
                    <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Waist</span>
                    <span className="text-2xl font-black text-white">{history[history.length-1].waist || '-'} cm</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-400">No logs yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Chart & Photos */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111827]/40 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-md h-80">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6 uppercase tracking-tight">
              <TrendingUp className="w-5 h-5 text-sky-500" /> Weight Tracker
            </h2>
            {history.length > 0 ? (
              <div className="h-48">
                <Line data={chartData} options={{ maintainAspectRatio: false, elements: { point: { radius: 4, hitRadius: 10, hoverRadius: 6, backgroundColor: '#0ea5e9' } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }, x: { grid: { display: false }, ticks: { color: '#9ca3af' } } }, plugins: { legend: { labels: { color: '#fff', font: { family: 'inherit', weight: 'bold' } } } } }} />
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 font-semibold text-sm">Not enough data to generate chart.</div>
            )}
          </div>

          <div className="bg-[#111827]/40 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Progress Gallery</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {history.filter(h => h.progressPhotos && h.progressPhotos.length > 0).map(h => (
                <div key={h._id} className="min-w-[150px] aspect-[3/4] rounded-2xl overflow-hidden relative border border-white/10 shrink-0 shadow-lg group">
                  <img src={h.progressPhotos[0]} alt="Progress" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12 text-[10px] text-zinc-300 font-bold tracking-wider">
                    {new Date(h.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {history.filter(h => h.progressPhotos && h.progressPhotos.length > 0).length === 0 && (
                <div className="w-full flex items-center justify-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-sm font-semibold text-slate-400">No progress photos uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Progress Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111827] border border-white/10 rounded-3xl w-full max-w-3xl shadow-2xl p-8 my-8 relative">
            <div className="border-b border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase">Log New Entry</h2>
              <p className="text-xs text-slate-400 mt-1">Record your latest body measurements and photos.</p>
            </div>
            
            <form onSubmit={submitLog} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Weight (kg)</label>
                  <input type="number" step="0.1" required value={form.weight} onChange={e => handleWeightChange(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" placeholder="e.g. 75" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Height (cm)</label>
                  <input type="number" step="0.1" value={form.height} onChange={e => handleHeightChange(e.target.value)} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" placeholder="e.g. 175" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">BMI (auto)</label>
                  <input type="text" readOnly value={form.bmi} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-sky-400 font-black focus:outline-none cursor-not-allowed" placeholder="—" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Body Fat %</label>
                  <input type="number" step="0.1" value={form.bodyFat} onChange={e => setForm({ ...form, bodyFat: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" placeholder="e.g. 15" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Chest (cm)</label>
                  <input type="number" step="0.1" value={form.chest} onChange={e => setForm({ ...form, chest: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Waist (cm)</label>
                  <input type="number" step="0.1" value={form.waist} onChange={e => setForm({ ...form, waist: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Hip (cm)</label>
                  <input type="number" step="0.1" value={form.hip} onChange={e => setForm({ ...form, hip: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Shoulders (cm)</label>
                  <input type="number" step="0.1" value={form.shoulders} onChange={e => setForm({ ...form, shoulders: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Biceps (cm)</label>
                  <input type="number" step="0.1" value={form.biceps} onChange={e => setForm({ ...form, biceps: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Forearms (cm)</label>
                  <input type="number" step="0.1" value={form.forearms} onChange={e => setForm({ ...form, forearms: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Thighs (cm)</label>
                  <input type="number" step="0.1" value={form.thighs} onChange={e => setForm({ ...form, thighs: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Calves (cm)</label>
                  <input type="number" step="0.1" value={form.calves} onChange={e => setForm({ ...form, calves: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider">Neck (cm)</label>
                  <input type="number" step="0.1" value={form.neck} onChange={e => setForm({ ...form, neck: e.target.value })} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider mt-2">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none transition-all" placeholder="How are you feeling today?" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 tracking-wider mt-2">Progress Photo</label>
                <div className="border border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-sky-500/50 hover:bg-sky-500/5 transition-all">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-40 object-cover rounded-xl shadow-lg mb-4" />
                    ) : (
                      <Upload className="w-10 h-10 text-slate-500 mb-3" />
                    )}
                    <span className="text-xs text-slate-300 font-semibold">{photoPreview ? 'Change Photo' : 'Upload latest physique photo'}</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-4 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setShowLogModal(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                <button disabled={saving} type="submit" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-900/20 transition-all active:scale-[0.98] disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProgress;
