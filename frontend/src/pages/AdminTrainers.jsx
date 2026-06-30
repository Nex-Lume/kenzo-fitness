import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserPlus, Edit, Trash2, ShieldAlert, X, Dumbbell } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  specialization: '',
  experience: '',
  salary: '',
};

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/trainers');
      if (response.data.success) setTrainers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name || '',
      email: trainer.user?.email || '',
      phone: trainer.user?.phone || '',
      specialization: trainer.specialization || '',
      experience: trainer.experience || '',
      salary: trainer.salary || '',
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTrainer(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
  };

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      if (editingTrainer) {
        const response = await api.put(`/trainers/${editingTrainer._id}`, {
          name: formData.name,
          specialization: formData.specialization,
          experience: Number(formData.experience),
          salary: Number(formData.salary),
        });
        if (response.data.success) { closeModal(); fetchTrainers(); }
      } else {
        const response = await api.post('/trainers', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          specialization: formData.specialization,
          experience: Number(formData.experience),
          salary: Number(formData.salary),
        });
        if (response.data.success) { closeModal(); fetchTrainers(); }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer? This will also delete their user account.')) {
      try {
        await api.delete(`/trainers/${id}`);
        setTrainers(trainers.filter(t => t._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete trainer');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-950/40 border-t-violet-500"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Trainer Management</h1>
          <p className="text-xs text-slate-500 mt-1">Manage personal trainers and assign members.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Trainer</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-indigo-950/40 bg-[#111827]/40 overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0c1122] text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-indigo-950/40">
            <tr>
              <th className="p-4">Trainer Name</th>
              <th className="p-4">Specialization</th>
              <th className="p-4">Experience</th>
              <th className="p-4">Salary</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-950/30 text-slate-300">
            {trainers.map((t) => (
              <tr key={t._id} className="hover:bg-[#111827]/60 transition-colors">
                <td className="p-4 font-semibold text-white">{t.name}</td>
                <td className="p-4 text-slate-400">{t.specialization || '—'}</td>
                <td className="p-4 text-slate-400">{t.experience ? `${t.experience} yrs` : '—'}</td>
                <td className="p-4 text-slate-400">{t.salary ? `₹${t.salary.toLocaleString()}` : '—'}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${t.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-white rounded-lg transition-colors border border-indigo-500/20"
                    title="Edit Trainer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                    title="Delete Trainer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {trainers.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500 text-xs">
                  <Dumbbell className="h-8 w-8 mx-auto mb-3 text-slate-700" />
                  No trainers found. Click <strong className="text-violet-400">Add Trainer</strong> to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-3xl border border-indigo-950/40 bg-[#111827] shadow-2xl p-8 relative">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {editingTrainer ? 'Update the trainer profile details below.' : 'Fill in the details to create a new trainer account.'}
              </p>
            </div>

            {/* Form Error */}
            {formError && (
              <div className="mb-5 flex items-start space-x-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name *</label>
                  <input
                    name="name" required value={formData.name} onChange={handleFormChange}
                    placeholder="Marcus Vance"
                    className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>

                {/* Email — only for new trainers */}
                {!editingTrainer && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email *</label>
                    <input
                      name="email" type="email" required value={formData.email} onChange={handleFormChange}
                      placeholder="trainer@kenzofitness.com"
                      className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                )}

                {/* Phone — only for new trainers */}
                {!editingTrainer && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone</label>
                    <input
                      name="phone" value={formData.phone} onChange={handleFormChange}
                      placeholder="+1 305 555 0001"
                      className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                    />
                  </div>
                )}

                {/* Specialization */}
                <div className={!editingTrainer ? '' : 'sm:col-span-2'}>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Specialization *</label>
                  <input
                    name="specialization" required value={formData.specialization} onChange={handleFormChange}
                    placeholder="e.g. Strength & Bodybuilding"
                    className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Experience (Years) *</label>
                  <input
                    name="experience" type="number" min="0" required value={formData.experience} onChange={handleFormChange}
                    placeholder="8"
                    className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Monthly Salary (₹)</label>
                  <input
                    name="salary" type="number" min="0" value={formData.salary} onChange={handleFormChange}
                    placeholder="4500"
                    className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
                  />
                </div>
              </div>

              {editingTrainer && (
                <p className="text-[10px] text-slate-600 italic">* Email and phone are tied to the user account and cannot be edited here.</p>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 rounded-xl border border-indigo-950/40 bg-transparent py-3 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-950/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingTrainer ? 'Save Changes' : 'Create Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTrainers;


