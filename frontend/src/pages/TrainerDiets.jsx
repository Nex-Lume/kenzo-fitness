import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Apple, Plus, Trash2, Edit3, X, ChevronDown, ChevronUp } from 'lucide-react';

const TrainerDiets = () => {
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
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    water: '',
    supplements: '',
    notes: '',
    meals: [{ mealType: 'Breakfast', foodItems: '', calories: '', notes: '' }],
    startDate: '',
    endDate: '',
    status: 'active'
  });

  useEffect(() => {
    fetchPlans();
    fetchMembers();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/diets');
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
        await api.put(`/diets/${editingPlan._id}`, form);
      } else {
        await api.post('/diets', form);
      }
      setShowForm(false);
      setEditingPlan(null);
      resetForm();
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving diet plan');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this diet plan?')) return;
    try {
      await api.delete(`/diets/${id}`);
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
      calories: plan.calories || '',
      protein: plan.protein || '',
      carbs: plan.carbs || '',
      fat: plan.fat || '',
      water: plan.water || '',
      supplements: plan.supplements || '',
      notes: plan.notes || '',
      meals: plan.meals?.length ? plan.meals : [{ mealType: 'Breakfast', foodItems: '', calories: '', notes: '' }],
      startDate: plan.startDate ? plan.startDate.split('T')[0] : '',
      endDate: plan.endDate ? plan.endDate.split('T')[0] : '',
      status: plan.status || 'active'
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      memberId: '',
      planName: '',
      goal: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      water: '',
      supplements: '',
      notes: '',
      meals: [{ mealType: 'Breakfast', foodItems: '', calories: '', notes: '' }],
      startDate: '',
      endDate: '',
      status: 'active'
    });
  };

  const addMeal = () => {
    setForm({ ...form, meals: [...form.meals, { mealType: 'Snack', foodItems: '', calories: '', notes: '' }] });
  };

  const removeMeal = (idx) => {
    setForm({ ...form, meals: form.meals.filter((_, i) => i !== idx) });
  };

  const updateMeal = (idx, field, value) => {
    const updated = [...form.meals];
    updated[idx][field] = value;
    setForm({ ...form, meals: updated });
  };

  const mealTypeLabels = {
    Breakfast: '🌅 Breakfast',
    Lunch: '☀️ Lunch',
    Dinner: '🌙 Dinner',
    Snack: '🍎 Snack',
  };

  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10',
    completed: 'text-blue-400 bg-blue-500/10',
    paused: 'text-[#c1ff00] bg-amber-500/10',
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Diet Plans...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Diet Plans</h1>
          <p className="text-xs text-gray-500 mt-1">Create and manage nutrition plans for your members.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingPlan(null); resetForm(); }}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-950/30"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Plan'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white">{editingPlan ? 'Edit Diet Plan' : 'Create Diet Plan'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Member *</label>
              <select value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none">
                <option value="">Select Member</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.fullName || m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Plan Name *</label>
              <input value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} required
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="e.g. Weight Loss Diet" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Goal</label>
              <input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="e.g. Calorie deficit" />
            </div>
          </div>

          {/* Macros */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Nutritional Targets</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-[#c1ff00] font-bold uppercase">Calories</p>
                <input value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} type="number" placeholder="2000"
                  className="w-full bg-transparent text-center text-lg font-black text-white mt-1 outline-none" />
                <p className="text-[10px] text-zinc-600">kcal/day</p>
              </div>
              <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-red-400 font-bold uppercase">Protein</p>
                <input value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} type="number" placeholder="150"
                  className="w-full bg-transparent text-center text-lg font-black text-white mt-1 outline-none" />
                <p className="text-[10px] text-zinc-600">grams</p>
              </div>
              <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-[#c1ff00] font-bold uppercase">Carbs</p>
                <input value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} type="number" placeholder="200"
                  className="w-full bg-transparent text-center text-lg font-black text-white mt-1 outline-none" />
                <p className="text-[10px] text-zinc-600">grams</p>
              </div>
              <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-[#c1ff00] font-bold uppercase">Fats</p>
                <input value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} type="number" placeholder="60"
                  className="w-full bg-transparent text-center text-lg font-black text-white mt-1 outline-none" />
                <p className="text-[10px] text-zinc-600">grams</p>
              </div>
              <div className="bg-zinc-950 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-[10px] text-cyan-400 font-bold uppercase">Water</p>
                <input value={form.water} onChange={(e) => setForm({ ...form, water: e.target.value })} placeholder="3L"
                  className="w-full bg-transparent text-center text-lg font-black text-white mt-1 outline-none" />
                <p className="text-[10px] text-zinc-600">per day</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Supplements</label>
              <input value={form.supplements} onChange={(e) => setForm({ ...form, supplements: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="e.g. Whey Protein, Creatine" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">General Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" placeholder="e.g. Cheat meal on Sunday" />
            </div>
          </div>

          {/* Meals */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Meals</label>
              <button type="button" onClick={addMeal} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Meal</button>
            </div>
            <div className="space-y-3">
              {form.meals.map((meal, idx) => (
                <div key={idx} className="bg-zinc-950 border border-white/10 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3 relative">
                  <select value={meal.mealType} onChange={(e) => updateMeal(idx, 'mealType', e.target.value)}
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                  <input value={meal.foodItems} onChange={(e) => updateMeal(idx, 'foodItems', e.target.value)} placeholder="Food Items"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                  <input value={meal.calories} onChange={(e) => updateMeal(idx, 'calories', e.target.value)} placeholder="Calories" type="number"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                  <input value={meal.notes} onChange={(e) => updateMeal(idx, 'notes', e.target.value)} placeholder="Notes"
                    className="bg-[#111111] border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-emerald-500" />
                  {form.meals.length > 1 && (
                    <button type="button" onClick={() => removeMeal(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg">
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.length === 0 ? (
          <div className="text-center py-16 bg-[#111111]/30 border border-white/10 rounded-2xl">
            <Apple className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No diet plans created yet.</p>
          </div>
        ) : (
          plans.map(plan => (
            <div key={plan._id} className="bg-[#111111]/30 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                onClick={() => setExpandedPlan(expandedPlan === plan._id ? null : plan._id)}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                    <Apple className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{plan.planName}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      For: <span className="text-zinc-300">{plan.memberId?.fullName || 'N/A'}</span>
                      {plan.calories && <> · <span className="text-[#c1ff00]">{plan.calories} kcal</span></>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
              {expandedPlan === plan._id && (
                <div className="border-t border-white/10 px-5 py-4 space-y-4">
                  {/* Macros Summary */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'Calories', val: plan.calories, unit: 'kcal', color: 'text-[#c1ff00]' },
                      { label: 'Protein', val: plan.protein, unit: 'g', color: 'text-red-400' },
                      { label: 'Carbs', val: plan.carbs, unit: 'g', color: 'text-[#c1ff00]' },
                      { label: 'Fats', val: plan.fat, unit: 'g', color: 'text-[#c1ff00]' },
                      { label: 'Water', val: plan.water, unit: '', color: 'text-cyan-400' },
                    ].map((m, i) => (
                      <div key={i} className="bg-zinc-950 border border-white/10 rounded-lg p-2 text-center">
                        <p className={`text-[10px] font-bold uppercase ${m.color}`}>{m.label}</p>
                        <p className="text-sm font-black text-white">{m.val || '—'}{m.unit && <span className="text-gray-500 text-[10px] ml-0.5">{m.unit}</span>}</p>
                      </div>
                    ))}
                  </div>
                  {(plan.supplements || plan.notes) && (
                    <div className="bg-zinc-950 border border-white/10 rounded-lg p-3 space-y-2">
                      {plan.supplements && (
                        <div>
                          <p className="text-[10px] text-emerald-400 font-bold uppercase">Supplements</p>
                          <p className="text-xs text-white mt-0.5">{plan.supplements}</p>
                        </div>
                      )}
                      {plan.notes && (
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">General Notes</p>
                          <p className="text-xs text-zinc-300 mt-0.5">{plan.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Meals */}
                  {plan.meals?.length > 0 && (
                    <div className="space-y-2">
                      {plan.meals.map((meal, i) => (
                        <div key={i} className="flex items-start gap-3 bg-zinc-950 border border-white/10 rounded-lg p-3">
                          <span className="text-sm">{mealTypeLabels[meal.mealType] || meal.mealType}</span>
                          <div className="flex-1">
                            <p className="text-xs text-white font-medium">{meal.foodItems}</p>
                            {meal.notes && <p className="text-[10px] text-gray-500 mt-0.5">{meal.notes}</p>}
                          </div>
                          {meal.calories && <span className="text-xs text-[#c1ff00] font-bold">{meal.calories} kcal</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerDiets;
