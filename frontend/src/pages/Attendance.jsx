import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance/member');
      if (res.data.success) {
        setAttendances(res.data.data);
        
        // Find today's attendance record
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = res.data.data.find(a => {
          const aDate = new Date(a.date).toISOString().split('T')[0];
          return aDate === today;
        });
        setTodayAttendance(todayRecord || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/attendance/checkin');
      if (res.data.success) {
        alert('Checked in successfully!');
        await fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/attendance/checkout');
      if (res.data.success) {
        alert('Checked out successfully!');
        await fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center space-x-2">
          <UserCheck className="h-7 w-7 text-emerald-500" />
          <span>My Attendance</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Check in and out of the gym, and track your visit history.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Today's Action Card */}
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 text-center flex flex-col items-center space-y-6">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest">Today's Session</h2>
        
        {loading ? (
          <div className="animate-pulse h-12 w-48 bg-white/5 rounded-xl"></div>
        ) : !todayAttendance ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 max-w-sm">You haven't checked in today. Please make sure you have booked a slot before checking in.</p>
            <button
              onClick={handleCheckIn}
              disabled={actionLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Check In Now'}
            </button>
          </div>
        ) : !todayAttendance.checkOut ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-emerald-400 mb-4">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-bold uppercase tracking-wider text-sm">Checked In at {new Date(todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <p className="text-sm text-gray-400">Have a great workout! Don't forget to check out when you leave.</p>
            <button
              onClick={handleCheckOut}
              disabled={actionLoading}
              className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-black uppercase tracking-wider px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Check Out'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-xl text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
              <span className="font-black uppercase tracking-wider">Session Completed</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Checked In: {new Date(todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} | 
              Checked Out: {new Date(todayAttendance.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </p>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-[#111111]/30 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10">
          <h3 className="font-bold text-white uppercase tracking-wide text-sm">Attendance History</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading history...</div>
        ) : attendances.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No attendance records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/50 text-gray-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {attendances.map(record => (
                  <tr key={record._id} className="hover:bg-white/5/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {record.checkIn ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
                    </td>
                    <td className="px-6 py-4 text-[#c1ff00] font-medium">
                      {record.checkOut ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
                    </td>
                    <td className="px-6 py-4">
                      {record.status === 'present' 
                        ? <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Present</span>
                        : <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Absent</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
