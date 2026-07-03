import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2, Power, X } from 'lucide-react';
import Toast from '../components/Toast';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add or edit
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationInDays: '',
    description: '',
    features: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/plans?includeInactive=true');
      if (response.data.success) {
        setPlans(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ name: '', price: '', durationInDays: '', description: '', features: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (plan) => {
    setModalMode('edit');
    setSelectedPlanId(plan._id);
    setFormData({
      name: plan.name,
      price: plan.price,
      durationInDays: plan.durationInDays,
      description: plan.description || '',
      features: plan.features.join('\n'), // join features with newline
      isActive: plan.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (plan) => {
    try {
      const response = await api.put(`/plans/${plan._id}`, { isActive: !plan.isActive });
      if (response.data.success) {
        setToastMsg(`Plan ${!plan.isActive ? 'activated' : 'deactivated'} successfully`);
        setPlans(plans.map(p => p._id === plan._id ? response.data.data : p));
      }
    } catch (err) {
      setToastMsg('Failed to update plan status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan? This may break member records if they are currently using it.')) return;
    try {
      const response = await api.delete(`/plans/${id}`);
      if (response.data.success) {
        setToastMsg('Plan deleted successfully');
        setPlans(plans.filter((p) => p._id !== id));
      }
    } catch (err) {
      setToastMsg('Failed to delete plan');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        durationInDays: Number(formData.durationInDays),
        features: formData.features.split('\n').filter(f => f.trim() !== ''),
      };

      if (modalMode === 'add') {
        const response = await api.post('/plans', payload);
        if (response.data.success) {
          setToastMsg('Plan added successfully');
          setPlans([...plans, response.data.data]);
        }
      } else {
        const response = await api.put(`/plans/${selectedPlanId}`, payload);
        if (response.data.success) {
          setToastMsg('Plan updated successfully');
          setPlans(plans.map(p => p._id === selectedPlanId ? response.data.data : p));
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-wider text-white">Membership Plans</h1>
          <p className="text-gray-400">Manage all available subscription plans</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold px-4 py-2 rounded-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Add Plan
        </button>
      </div>

      <ErrorMessage message={error} />
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {loading ? (
        <LoadingSpinner />
      ) : plans.length === 0 ? (
        <EmptyState message="No membership plans found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className={`bg-zinc-950 border ${plan.isActive ? 'border-white/10' : 'border-white/10 opacity-60'} rounded-xl p-6 relative`}>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleToggleActive(plan)}
                  title={plan.isActive ? 'Deactivate' : 'Activate'}
                  className={`p-1.5 rounded-md transition-colors ${plan.isActive ? 'bg-[#111111] text-emerald-500 hover:bg-emerald-500/20' : 'bg-[#111111] text-gray-500 hover:bg-emerald-500/20 hover:text-emerald-500'}`}
                >
                  <Power className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEditModal(plan)}
                  className="p-1.5 rounded-md bg-[#111111] text-blue-500 hover:bg-blue-500/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="p-1.5 rounded-md bg-[#111111] text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{plan.name}</h2>
              <div className="flex items-end gap-1 mb-4">
                <span className="text-3xl font-black text-[#c1ff00]">₹{plan.price}</span>
                <span className="text-gray-500 text-sm mb-1">/ {plan.durationInDays} days</span>
              </div>
              
              {!plan.isActive && (
                <div className="mb-4 inline-block bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Inactive
                </div>
              )}

              <ul className="space-y-2 mt-6 border-t border-zinc-900 pt-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{modalMode === 'add' ? 'Add Plan' : 'Edit Plan'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-zinc-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1">Short Description (shown on homepage card)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Build both power and technical precision"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.durationInDays}
                    onChange={(e) => setFormData({ ...formData, durationInDays: e.target.value })}
                    className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1">Features (One per line)</label>
                <textarea
                  rows="4"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="24/7 Access&#10;Free classes&#10;Personal trainer"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="isActive" className="text-sm text-zinc-300">Plan is active and visible</label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-bold text-zinc-950 bg-orange-500 hover:bg-orange-600 rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <LoadingSpinner size="sm" />}
                  {modalMode === 'add' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
