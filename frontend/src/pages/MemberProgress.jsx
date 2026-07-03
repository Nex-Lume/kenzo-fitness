import React, { useState, useEffect } from 'react';
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
          className="bg-sky-500 text-sky-950 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-sky-600 transition-colors"
        >
          Log Progress
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Goals & Current Stats */}
        <div className="space-y-6">
          <div className="bg-[#111111]/30 border border-zinc-900 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-sky-500" /> Current Goals
            </h2>
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
            {goals.length === 0 && <p className="text-xs text-gray-500">No active goals.</p>}
          </div>

          <div className="bg-[#111111]/30 border border-zinc-900 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-emerald-500" /> Latest Log
            </h2>
            {history.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-white/10 p-4 rounded-xl text-center">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Weight</span>
                  <span className="text-2xl font-black text-white">{history[history.length-1].weight} kg</span>
                </div>
                <div className="bg-zinc-950 border border-white/10 p-4 rounded-xl text-center">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">BMI</span>
                  <span className="text-2xl font-black text-sky-400">{history[history.length-1].bmi || '-'}</span>
                </div>
                <div className="bg-zinc-950 border border-white/10 p-4 rounded-xl text-center">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Body Fat</span>
                  <span className="text-2xl font-black text-white">{history[history.length-1].bodyFat || '-'}%</span>
                </div>
                <div className="bg-zinc-950 border border-white/10 p-4 rounded-xl text-center">
                  <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Waist</span>
                  <span className="text-2xl font-black text-white">{history[history.length-1].waist || '-'} cm</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No logs yet.</p>
            )}
          </div>
        </div>

        {/* Chart & Photos */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111111]/30 border border-zinc-900 p-6 rounded-2xl h-80">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-sky-500" /> Weight Tracker
            </h2>
            {history.length > 0 ? (
              <Line data={chartData} options={{ maintainAspectRatio: false }} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">Not enough data to generate chart.</div>
            )}
          </div>

          <div className="bg-[#111111]/30 border border-zinc-900 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Progress Gallery</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {history.filter(h => h.progressPhotos && h.progressPhotos.length > 0).map(h => (
                <div key={h._id} className="min-w-[150px] aspect-[3/4] rounded-xl overflow-hidden relative border border-white/10 shrink-0">
                  <img src={h.progressPhotos[0]} alt="Progress" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 text-[10px] text-zinc-300 font-bold">
                    {new Date(h.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {history.filter(h => h.progressPhotos && h.progressPhotos.length > 0).length === 0 && (
                <p className="text-xs text-gray-500 w-full text-center py-8">No progress photos uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Progress Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl p-6 my-8 relative">
            <h2 className="text-xl font-bold text-white mb-6">Log New Entry</h2>
            
            <form onSubmit={submitLog} className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Weight (kg)</label>
                  <input type="number" step="0.1" required value={form.weight} onChange={e => handleWeightChange(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="e.g. 75" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Height (cm)</label>
                  <input type="number" step="0.1" value={form.height} onChange={e => handleHeightChange(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="e.g. 175" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">BMI (auto)</label>
                  <input type="text" readOnly value={form.bmi} className="w-full bg-zinc-950/50 border border-white/10 rounded-lg px-4 py-3 text-sky-400 font-bold focus:outline-none cursor-not-allowed" placeholder="—" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Body Fat %</label>
                  <input type="number" step="0.1" value={form.bodyFat} onChange={e => setForm({ ...form, bodyFat: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" placeholder="e.g. 15" />
                </div>
                
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Chest (cm)</label>
                  <input type="number" step="0.1" value={form.chest} onChange={e => setForm({ ...form, chest: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Waist (cm)</label>
                  <input type="number" step="0.1" value={form.waist} onChange={e => setForm({ ...form, waist: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Hip (cm)</label>
                  <input type="number" step="0.1" value={form.hip} onChange={e => setForm({ ...form, hip: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Shoulders (cm)</label>
                  <input type="number" step="0.1" value={form.shoulders} onChange={e => setForm({ ...form, shoulders: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Biceps (cm)</label>
                  <input type="number" step="0.1" value={form.biceps} onChange={e => setForm({ ...form, biceps: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Forearms (cm)</label>
                  <input type="number" step="0.1" value={form.forearms} onChange={e => setForm({ ...form, forearms: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Thighs (cm)</label>
                  <input type="number" step="0.1" value={form.thighs} onChange={e => setForm({ ...form, thighs: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Calves (cm)</label>
                  <input type="number" step="0.1" value={form.calves} onChange={e => setForm({ ...form, calves: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Neck (cm)</label>
                  <input type="number" step="0.1" value={form.neck} onChange={e => setForm({ ...form, neck: e.target.value })} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 mt-2">Notes</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 resize-none" placeholder="How are you feeling today?" />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2 mt-2">Progress Photo</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-sky-500/50 transition-colors">
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-32 object-cover rounded-lg shadow-lg mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-zinc-600 mb-2" />
                    )}
                    <span className="text-xs text-gray-400 font-semibold">{photoPreview ? 'Change Photo' : 'Upload latest physique photo'}</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setShowLogModal(false)} className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 text-sm font-bold text-sky-950 bg-sky-500 hover:bg-sky-600 rounded-lg">Save Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProgress;
