import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Dumbbell,
  Phone,
  Mail,
  SlidersHorizontal
} from 'lucide-react';

const FALLBACK_PLANS = [
  { _id: '1', name: 'Monthly Plan', price: 49 },
  { _id: '2', name: 'Quarterly Plan', price: 129 },
  { _id: '3', name: 'Yearly Plan', price: 399 },
];

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  // Pagination (simple frontend)
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modals / Panels
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    emergencyContact: '',
    membershipPlan: '',
    paymentStatus: 'pending',
    status: 'pending',
    password: '',
  });

  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await api.get('/members');
      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setError(err.response?.data?.message || 'Failed to fetch members list.');
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      if (response.data.success && response.data.data.length > 0) {
        setPlans(response.data.data);
      } else {
        setPlans(FALLBACK_PLANS);
      }
    } catch (err) {
      console.warn('Plans fetch failed in members page:', err.message);
      setPlans(FALLBACK_PLANS);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      await Promise.all([fetchMembers(), fetchPlans()]);
      setLoading(false);
    };
    initPage();
  }, []);

  // Pre-select first plan when plans list updates
  useEffect(() => {
    if (plans.length > 0 && !formData.membershipPlan) {
      setFormData(prev => ({ ...prev, membershipPlan: plans[0]._id }));
    }
  }, [plans]);

  const handleOpenAdd = () => {
    setFormError(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      address: '',
      emergencyContact: '',
      membershipPlan: plans[0]?._id || '',
      paymentStatus: 'pending',
      status: 'pending',
      password: '',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (member) => {
    setFormError(null);
    setSelectedMemberId(member._id);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      age: member.age.toString(),
      gender: member.gender,
      address: member.address,
      emergencyContact: member.emergencyContact,
      membershipPlan: member.membershipPlan?._id || '',
      paymentStatus: member.paymentStatus,
      status: member.status,
      password: '', // Leave empty for no password update
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitLoading(true);

    try {
      const response = await api.post('/members', {
        ...formData,
        age: parseInt(formData.age, 10),
      });

      if (response.data.success) {
        await fetchMembers();
        setShowAddModal(false);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create member.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitLoading(true);

    try {
      const response = await api.put(`/members/${selectedMemberId}`, {
        ...formData,
        age: parseInt(formData.age, 10),
      });

      if (response.data.success) {
        await fetchMembers();
        setShowEditModal(false);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update member.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (memberId, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete ${name} and their system login?`)) {
      try {
        const response = await api.delete(`/members/${memberId}`);
        if (response.data.success) {
          setMembers(members.filter((m) => m._id !== memberId));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete member.');
      }
    }
  };

  // Filter logic
  const filteredMembers = members.filter((member) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchString) ||
      member.email.toLowerCase().includes(searchString) ||
      member.phone.toLowerCase().includes(searchString);

    const matchesStatus =
      statusFilter === 'all' || member.status === statusFilter;
      
    const matchesPayment =
      paymentFilter === 'all' || member.paymentStatus === paymentFilter;
      
    const matchesPlan =
      planFilter === 'all' || (member.membershipPlan && member.membershipPlan._id === planFilter);

    return matchesSearch && matchesStatus && matchesPayment && matchesPlan;
  });
  
  const totalPages = Math.ceil(filteredMembers.length / limit);
  const paginatedMembers = filteredMembers.slice((page - 1) * limit, page * limit);
  
  const handleUpdatePayment = async (id, newStatus) => {
    try {
      const response = await api.put(`/members/${id}/payment-status`, { paymentStatus: newStatus });
      if (response.data.success) {
        await fetchMembers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    }
  };

  const handleRenew = async (memberId, planId) => {
    try {
      const response = await api.put(`/members/${memberId}/renew`, {
        membershipPlan: planId,
        paymentStatus: 'paid'
      });
      if (response.data.success) {
        await fetchMembers();
        alert('Member renewed successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to renew member');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 capitalize">Active</span>;
      case 'pending':
        return <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 capitalize animate-pulse">Pending</span>;
      default:
        return <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-[10px] font-bold text-zinc-500 capitalize">Inactive</span>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">Paid</span>;
      case 'pending':
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold text-amber-400 uppercase">Pending</span>;
      default:
        return <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400 uppercase">Unpaid</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center space-x-2">
            <Users className="h-7 w-7 text-orange-500" />
            <span>Members Directory</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Add, edit, status-manage, or remove KenzoFitness members.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-xs font-bold text-zinc-950 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Gym Member</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Pane */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-600">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-xl border border-zinc-900 bg-zinc-900/20 py-2.5 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
          {/* Status Filter */}
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <span className="text-zinc-500 hidden sm:block">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="rounded-xl border border-zinc-900 bg-zinc-900/20 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-orange-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <span className="text-zinc-500 hidden sm:block">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
              className="rounded-xl border border-zinc-900 bg-zinc-900/20 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-orange-500"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="unpaid">Unpaid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <span className="text-zinc-500 hidden sm:block">Plan:</span>
            <select
              value={planFilter}
              onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
              className="rounded-xl border border-zinc-900 bg-zinc-900/20 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-orange-500"
            >
              <option value="all">All Plans</option>
              {plans.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          {(searchTerm !== '' || statusFilter !== 'all' || paymentFilter !== 'all' || planFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPaymentFilter('all');
                setPlanFilter('all');
                setPage(1);
              }}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-white shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Grid table */}
      <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 overflow-hidden">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 text-xs">
            No gym members found matching the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950/40 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Plan Selected</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Expiry Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {paginatedMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-zinc-100">{member.fullName}</td>
                    <td className="py-4 px-4 space-y-0.5">
                      <span className="block text-zinc-200">{member.email}</span>
                      <span className="block text-zinc-500 text-[10px]">{member.phone}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-orange-400">
                      {member.membershipPlan?.name || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {getPaymentBadge(member.paymentStatus)}
                        <select
                          value={member.paymentStatus}
                          onChange={(e) => handleUpdatePayment(member._id, e.target.value)}
                          className="mt-1 text-[10px] bg-zinc-950 border border-zinc-800 rounded px-1 py-0.5 text-zinc-400 focus:outline-none"
                        >
                          <option value="paid">Mark Paid</option>
                          <option value="pending">Mark Pending</option>
                          <option value="unpaid">Mark Unpaid</option>
                          <option value="failed">Mark Failed</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-zinc-500 font-semibold">
                      {new Date(member.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(member.status)}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => {
                          if (member.membershipPlan) {
                            handleRenew(member._id, member.membershipPlan._id);
                          } else {
                            alert('Please edit member to assign a plan first.');
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-400 hover:text-white hover:border-emerald-500 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider px-2"
                        title="Quick Renew with Current Plan"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-1.5 text-zinc-400 hover:text-white hover:border-orange-500 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id, member.fullName)}
                        className="inline-flex items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 p-1.5 text-red-400 hover:bg-red-500/20 hover:text-white transition-colors cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ADD / EDIT MODAL OVERLAY */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-900 bg-zinc-900 p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-black text-white uppercase mb-6 flex items-center space-x-2">
              <Dumbbell className="h-5.5 w-5.5 text-orange-500" />
              <span>{showAddModal ? 'Add New Member' : 'Edit Member Details'}</span>
            </h2>

            {formError && (
              <div className="mb-6 flex items-start space-x-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Marcus Vance"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marcus@example.com"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 018-9999"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Password / Login Info */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    {showAddModal ? 'Create Password (Login)' : 'Update Password (optional)'}
                  </label>
                  <input
                    type="password"
                    required={showAddModal}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={showAddModal ? '••••••••' : 'Leave blank to retain current'}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Age</label>
                  <input
                    type="number"
                    required
                    min={12}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-4 text-xs text-zinc-100 outline-none focus:border-orange-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Fitness Ave, Apt 4B, Iron City"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Emergency Contact */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Emergency Contact Details</label>
                  <input
                    type="text"
                    required
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Jane Doe (+1 555-018-9988)"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-700 outline-none focus:border-orange-500"
                  />
                </div>

                {/* Plan */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Membership Plan</label>
                  <select
                    value={formData.membershipPlan}
                    onChange={(e) => setFormData({ ...formData, membershipPlan: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-4 text-xs text-zinc-100 outline-none focus:border-orange-500"
                  >
                    {plans.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} - ${p.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-4 text-xs text-zinc-100 outline-none focus:border-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 px-4 text-xs text-zinc-100 outline-none focus:border-orange-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="mt-8 flex justify-end space-x-3 border-t border-zinc-800 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 px-5 py-2.5 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 px-6 py-2.5 text-xs font-bold text-zinc-950 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
