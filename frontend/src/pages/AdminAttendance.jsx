import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserCheck, Calendar as CalendarIcon, RefreshCw, X } from 'lucide-react';

const AdminAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(''); // empty = show all

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const url = filterDate ? `/attendance?date=${filterDate}` : '/attendance';
      const res = await api.get(url);
      if (res.data.success) setAttendances(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [filterDate]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center space-x-2">
            <UserCheck className="h-7 w-7 text-[#c1ff00]" />
            <span>Attendance Log</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">View member check-ins filtered by date.</p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Date filter */}
          <div className="flex items-center space-x-2 rounded-xl border border-white/10 bg-[#0a0a0a] px-3 py-2">
            <CalendarIcon className="h-4 w-4 text-[#c1ff00]" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none"
            />
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="text-slate-500 hover:text-white transition-colors ml-1">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {/* Refresh */}
          <button
            onClick={fetchAttendance}
            className="flex items-center space-x-1.5 rounded-xl border border-white/10 bg-[#0a0a0a] px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#111827]/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Records</p>
          <p className="text-2xl font-black text-white mt-1">{attendances.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111827]/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Present</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{attendances.filter(a => a.status === 'present').length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#111827]/40 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Checked Out</p>
          <p className="text-2xl font-black text-[#c1ff00] mt-1">{attendances.filter(a => a.checkOut).length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 bg-[#111827]/40 overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-violet-500"></div>
          </div>
        ) : attendances.length === 0 ? (
          <div className="py-20 text-center">
            <UserCheck className="h-10 w-10 mx-auto mb-3 text-slate-700" />
            <p className="text-slate-500 text-sm">No attendance records found{filterDate ? ` for ${filterDate}` : ''}.</p>
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="mt-3 text-xs text-[#c1ff00] hover:underline">Clear filter to show all records</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#111111] text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Slot Booked</th>
                  <th className="px-6 py-4">Check In</th>
                  <th className="px-6 py-4">Check Out</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950/30 text-slate-300">
                {attendances.map(a => (
                  <tr key={a._id} className="hover:bg-[#111827]/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{a.member?.fullName || 'Unknown Member'}</p>
                      <p className="text-[10px] text-slate-500">{a.member?.email || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {a.date ? new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {a.booking && a.booking.slot ? (
                        <>
                          <p className="font-semibold text-[#c1ff00]">{a.booking.slot.slotName}</p>
                          <p className="text-[10px] text-slate-500">{a.booking.slot.startTime} - {a.booking.slot.endTime}</p>
                        </>
                      ) : (
                        <span className="text-slate-600 italic">No Slot</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">
                      {a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-[#c1ff00] font-semibold">
                      {a.checkOut ? new Date(a.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {a.status === 'present'
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

export default AdminAttendance;
