import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Calendar, User, Phone, MapPin, ShieldAlert, CreditCard, Clock, Activity, QrCode } from 'lucide-react';

const MemberDashboard = () => {
  const { user, member: authMember } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [plans, setPlans] = useState([]);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [renewLoading, setRenewLoading] = useState(false);
  const [renewError, setRenewError] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const [peakTime, setPeakTime] = useState([]);
  const [upcomingBooking, setUpcomingBooking] = useState(null);

  // Phase 4 fields
  const [activeWorkouts, setActiveWorkouts] = useState([]);
  const [activeDiets, setActiveDiets] = useState([]);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!user) return;

      try {
        let memberId = authMember?._id;
        if (!memberId) {
          const profileResponse = await api.get('/auth/me');
          memberId = profileResponse.data.member?._id;
        }

        if (!memberId) {
          setError('Could not locate a gym membership associated with this account. Please contact an administrator.');
          setLoading(false);
          return;
        }

        const response = await api.get(`/members/${memberId}`);
        if (response.data.success) {
          setMember(response.data.data);
        }

        const plansRes = await api.get('/plans');
        if (plansRes.data.success) {
          setPlans(plansRes.data.data);
          if (plansRes.data.data.length > 0) {
            setSelectedPlanId(plansRes.data.data[0]._id);
          }
        }

        // Fetch Peak Time
        const peakRes = await api.get('/dashboard/peak-time');
        if (peakRes.data.success) {
          setPeakTime(peakRes.data.data);
        }

        // Fetch Bookings
        const bookingsRes = await api.get('/bookings/member');
        if (bookingsRes.data.success) {
          const today = new Date();
          today.setHours(0,0,0,0);
          const upcoming = bookingsRes.data.data.find(b => new Date(b.date) >= today && b.status === 'booked');
          setUpcomingBooking(upcoming || null);
        }

        // Fetch Workouts
        const workoutsRes = await api.get(`/workouts/member/${memberId}`);
        if (workoutsRes.data.success) {
          setActiveWorkouts(workoutsRes.data.data.filter(p => p.status === 'active'));
        }

        // Fetch Diets
        const dietsRes = await api.get(`/diets/member/${memberId}`);
        if (dietsRes.data.success) {
          setActiveDiets(dietsRes.data.data.filter(p => p.status === 'active'));
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user, authMember]);

  const handleRenew = async (e) => {
    e.preventDefault();
    setRenewLoading(true);
    setRenewError('');
    try {
      const response = await api.put(`/members/${member._id}/renew`, {
        membershipPlan: selectedPlanId,
        paymentStatus: 'pending'
      });
      
      if (response.data.success) {
        setMember(response.data.data);
        setShowRenewModal(false);
        setToastMsg('Renewal request submitted. Admin will verify payment.');
      }
    } catch (err) {
      setRenewError(err.response?.data?.message || 'Failed to submit renewal request.');
    } finally {
      setRenewLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 capitalize">Active</span>;
      case 'pending':
        return <span className="rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-bold text-[#c1ff00] capitalize animate-pulse">Pending Approval</span>;
      default:
        return <span className="rounded-full bg-[#111111] border border-white/10 px-3 py-1 text-xs font-bold text-gray-500 capitalize">Inactive</span>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 uppercase">Paid</span>;
      case 'pending':
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-[#c1ff00] uppercase">Pending</span>;
      default:
        return <span className="rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-400 uppercase">Unpaid</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-[#c1ff00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-zinc-900 bg-[#111111]/20 p-6 text-center text-gray-400 max-w-xl mx-auto mt-10">
        <ShieldAlert className="h-10 w-10 text-[#c1ff00] mx-auto mb-4" />
        <h3 className="text-base font-bold text-white mb-2">Membership Check Failed</h3>
        <p className="text-xs leading-relaxed text-gray-500">{error}</p>
      </div>
    );
  }

  const daysToExpiry = member?.expiryDate ? Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative">
      {toastMsg && (
        <div className="absolute top-0 right-0 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-semibold animate-fade-in-up">
          {toastMsg}
        </div>
      )}

      {/* Expiry Warning Banner */}
      {daysToExpiry !== null && daysToExpiry <= 15 && daysToExpiry >= 0 && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center space-x-3 text-red-400">
          <ShieldAlert className="h-6 w-6 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold">Membership Expiring Soon!</h4>
            <p className="text-xs text-red-400/80 mt-0.5">Your membership expires in {daysToExpiry} days. Renew now to avoid interruption.</p>
          </div>
          <button onClick={() => setShowRenewModal(true)} className="bg-red-500 text-red-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-red-600 transition-colors">
            Renew Now
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Welcome, {user?.name}!</h1>
          <p className="text-xs text-gray-500 mt-1">Here is the status of your KenzoFitness fitness membership.</p>
        </div>
        <button
          onClick={() => setShowRenewModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold px-4 py-2 rounded-lg transition-all"
        >
          Renew Membership
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Membership Status Card */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-900 bg-[#111111]/30 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Membership Summary</span>
            </h3>
            {getStatusBadge(member?.status)}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Active Plan</span>
              <h4 className="text-lg font-black text-[#c1ff00]">{member?.membershipPlan?.name || 'No Plan Selected'}</h4>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Payment Status</span>
              <div className="mt-1">{getPaymentBadge(member?.paymentStatus)}</div>
            </div>
          </div>

          <hr className="border-zinc-900" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="flex items-center space-x-3 text-gray-400">
              <Calendar className="h-4 w-4 text-zinc-600 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-500 block font-bold uppercase">Start Date</span>
                <span className="text-white font-semibold">{formatDate(member?.startDate)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-400">
              <Clock className="h-4 w-4 text-zinc-600 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-500 block font-bold uppercase">Expiration Date</span>
                <span className="text-white font-semibold">{formatDate(member?.expiryDate)}</span>
              </div>
            </div>
          </div>

          {member?.status === 'pending' && (
            <div className="rounded-xl bg-[#c1ff00]/5 border border-orange-500/10 p-4 text-[11px] text-[#c1ff00]/90 leading-relaxed">
              <strong>Admission Status: Pending Approval.</strong> Your gym admission request has been sent to the gym staff. Please complete your registration payment at the desk to activate your keycard.
            </div>
          )}
        </div>

        {/* Quick Stats sidebar */}
        <div className="space-y-6">
          {/* Active Plans Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <h3 className="text-base font-bold text-emerald-500 border-b border-emerald-500/20 pb-3 mb-4 flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Active Plans</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-300">Workout Plans</span>
                <span className="text-xs font-bold text-emerald-400">{activeWorkouts.length} Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-300">Diet Plans</span>
                <span className="text-xs font-bold text-emerald-400">{activeDiets.length} Active</span>
              </div>
            </div>
          </div>

          {/* Upcoming Booking Card */}
          <div className="rounded-2xl border border-orange-500/30 bg-[#c1ff00]/5 p-6">
            <h3 className="text-base font-bold text-[#c1ff00] border-b border-orange-500/20 pb-3 mb-4 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Upcoming Booking</span>
            </h3>
            {upcomingBooking ? (
              <div>
                <p className="text-sm font-bold text-white">{upcomingBooking.slot?.slotName}</p>
                <p className="text-xs text-[#c1ff00] font-semibold mt-1">{upcomingBooking.slot?.startTime} - {upcomingBooking.slot?.endTime}</p>
                <p className="text-[10px] text-gray-500 mt-2">{new Date(upcomingBooking.date).toLocaleDateString()}</p>
                
                {/* QR Code Button */}
                <button 
                  onClick={() => window.open(`http://localhost:5000/api/qr/${upcomingBooking._id}`, '_blank')}
                  className="mt-4 w-full flex items-center justify-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold py-2 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Check-In QR</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500">No upcoming bookings for today. Book a slot to secure your workout time!</p>
            )}
          </div>

          {/* Today's Crowd Card */}
          <div className="rounded-2xl border border-zinc-900 bg-[#111111]/30 p-6">
            <h3 className="text-base font-bold text-white border-b border-zinc-900 pb-3 mb-4 flex items-center space-x-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Today's Crowd</span>
            </h3>
            {peakTime.length === 0 ? (
              <p className="text-xs text-gray-500">Loading crowd data...</p>
            ) : (
              <div className="space-y-3">
                {peakTime.slice(0, 3).map(slot => (
                  <div key={slot._id} className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-zinc-300">{slot.startTime}</p>
                      <p className="text-[10px] text-gray-500">{slot.slotName}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${slot.status === 'Peak' ? 'bg-red-500/10 text-red-400' : slot.status === 'Medium' ? 'bg-amber-500/10 text-[#c1ff00]' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {slot.status}
                    </span>
                  </div>
                ))}
                <p className="text-[10px] text-center text-gray-500 pt-2 border-t border-white/10">
                  <a href="/dashboard/book-slot" className="text-[#c1ff00] hover:underline">View all slots</a>
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-[#111111]/30 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white border-b border-zinc-900 pb-4 mb-4 flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-[#c1ff00]" />
                <span>Billing Details</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Plan Cost</span>
                  <span className="text-2xl font-black text-white">${member?.membershipPlan?.price || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Access Interval</span>
                  <span className="text-xs text-zinc-300 font-semibold">{member?.membershipPlan?.durationInDays || 0} Days Validity</span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-zinc-950 p-3 text-[10px] text-gray-500 text-center leading-relaxed">
              Need support? Email us at <br />
              <span className="text-[#c1ff00] font-semibold">support@kenzofitness.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Profile Details */}
      <div className="rounded-2xl border border-zinc-900 bg-[#111111]/30 p-6">
        <h3 className="text-base font-bold text-white border-b border-zinc-900 pb-4 mb-6 flex items-center space-x-2">
          <User className="h-4 w-4 text-emerald-400" />
          <span>Personal Information Details</span>
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 text-xs">
          <div>
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Full Name</span>
            <span className="text-white font-semibold">{member?.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Email Address</span>
            <span className="text-white font-semibold">{member?.email}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Phone Number</span>
            <span className="text-white font-semibold">{member?.phone}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Age</span>
            <span className="text-white font-semibold">{member?.age} Years</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Gender</span>
            <span className="text-white font-semibold">{member?.gender}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Emergency Contact</span>
            <span className="text-white font-semibold">{member?.emergencyContact}</span>
          </div>
          <div className="sm:col-span-2 md:col-span-3">
            <span className="text-[10px] text-gray-500 block font-bold uppercase mb-1">Residential Address</span>
            <span className="text-white font-semibold flex items-center space-x-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
              <span>{member?.address}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Renew Membership</h2>
            {renewError && <div className="text-red-400 text-sm mb-4">{renewError}</div>}
            
            <form onSubmit={handleRenew} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-2">Select Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                >
                  {plans.map(p => (
                    <option key={p._id} value={p._id}>{p.name} - ${p.price}</option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRenewModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-white/5 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renewLoading}
                  className="px-4 py-2 text-sm font-bold text-zinc-950 bg-orange-500 hover:bg-orange-600 rounded-lg disabled:opacity-50"
                >
                  {renewLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
