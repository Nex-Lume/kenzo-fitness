import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Clock, Plus, Trash2, Edit2, AlertCircle, X, Dumbbell } from 'lucide-react';

const AdminSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    slotName: '',
    startTime: '',
    endTime: '',
    capacity: 25,
    status: 'active'
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/slots');
      if (res.data.success) {
        setSlots(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData({
      slotName: '',
      startTime: '',
      endTime: '',
      capacity: 25,
      status: 'active'
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (slot) => {
    setEditMode(true);
    setSelectedSlotId(slot._id);
    setFormData({
      slotName: slot.slotName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      status: slot.status
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/slots/${selectedSlotId}`, formData);
      } else {
        await api.post('/slots', formData);
      }
      setShowModal(false);
      fetchSlots();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save slot');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the slot: ${name}?`)) return;
    try {
      await api.delete(`/slots/${id}`);
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete slot');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center space-x-2">
            <Clock className="h-7 w-7 text-orange-500" />
            <span>Manage Gym Slots</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Create, update, or disable booking timeslots.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold px-4 py-2 rounded-xl flex items-center justify-center space-x-2 text-sm transition-colors w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Slot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-zinc-500 animate-pulse">Loading slots...</div>
        ) : slots.length === 0 ? (
          <div className="col-span-full py-10 text-center text-zinc-500">No gym slots found.</div>
        ) : (
          slots.map((slot) => (
            <div key={slot._id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 relative group">
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenEdit(slot)} className="text-zinc-400 hover:text-white bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => handleDelete(slot._id, slot.slotName)} className="text-red-400 hover:text-red-300 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="pr-16">
                <h3 className="text-lg font-bold text-zinc-100">{slot.slotName}</h3>
                <div className="flex items-center space-x-1.5 text-orange-400 text-xs font-semibold mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Capacity</span>
                  <span className="text-sm font-semibold text-zinc-300">{slot.capacity} Max</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</span>
                  <span className={`text-xs font-bold uppercase ${slot.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {slot.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 md:p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center space-x-2 mb-6">
              <Dumbbell className="h-5.5 w-5.5 text-orange-500" />
              <span>{editMode ? 'Edit Gym Slot' : 'Add Gym Slot'}</span>
            </h2>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-xs text-red-400 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Slot Name</label>
                <input
                  type="text"
                  required
                  value={formData.slotName}
                  onChange={e => setFormData({...formData, slotName: e.target.value})}
                  placeholder="e.g. Morning Cardio"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    placeholder="e.g. 6:00 AM"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    placeholder="e.g. 7:00 AM"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-zinc-800 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-bold text-zinc-950">
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlots;
