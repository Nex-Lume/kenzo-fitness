import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Save, X } from 'lucide-react';
import Toast from '../components/Toast';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const MemberProfile = () => {
  const { member, loadUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName || '',
        phone: member.phone || '',
        age: member.age || '',
        gender: member.gender || 'Male',
        address: member.address || '',
        emergencyContact: member.emergencyContact || '',
      });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/members/profile', formData);
      if (response.data.success) {
        setToastMsg('Profile updated successfully');
        setIsEditing(false);
        await loadUser(); // refresh context data
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!member) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-wider text-white">My Profile</h1>
          <p className="text-gray-400">View and manage your personal details</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold px-4 py-2 rounded-lg transition-all"
          >
            Edit Profile
          </button>
        )}
      </div>

      <ErrorMessage message={error} />
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="bg-zinc-950 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 bg-[#111111] border-b border-white/10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-2xl font-black text-zinc-950 uppercase">
            {member.fullName[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{member.fullName}</h2>
            <p className="text-gray-400">{member.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Email Address</label>
              <input
                type="email"
                value={member.email}
                disabled
                className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed opacity-50"
              />
              <p className="text-[10px] text-gray-500 mt-1">Email cannot be changed directly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Emergency Contact</label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="w-full bg-[#111111] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
            />
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: member.fullName,
                    phone: member.phone,
                    age: member.age,
                    gender: member.gender,
                    address: member.address,
                    emergencyContact: member.emergencyContact,
                  });
                }}
                className="flex items-center gap-2 bg-[#111111] hover:bg-white/5 text-zinc-300 px-6 py-2.5 rounded-lg transition-all"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold px-6 py-2.5 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default MemberProfile;
