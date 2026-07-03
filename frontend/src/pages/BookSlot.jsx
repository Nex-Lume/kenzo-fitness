import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Trash2 } from 'lucide-react';

const BookSlot = () => {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [slotsRes, bookingsRes] = await Promise.all([
        api.get(`/slots?date=${selectedDate}`),
        api.get('/bookings/member')
      ]);

      if (slotsRes.data.success) {
        setSlots(slotsRes.data.data);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleBook = async (slotId) => {
    try {
      setBookingLoading(true);
      const res = await api.post('/bookings', { slotId, date: selectedDate });
      if (res.data.success) {
        await fetchData(); // Refresh data
        alert('Slot booked successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book slot');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        await fetchData();
        alert('Booking cancelled successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getOccupancyColor = (booked, capacity) => {
    if (capacity === 0) return 'bg-white/5';
    const percent = (booked / capacity) * 100;
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 60) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  // Determine if the user has already booked a slot on the selected date
  const hasBookingOnSelectedDate = bookings.some(b => {
    if (b.status !== 'booked') return false;
    const bDate = new Date(b.date).toISOString().split('T')[0];
    return bDate === selectedDate;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center space-x-2">
          <Clock className="h-7 w-7 text-[#c1ff00]" />
          <span>Book a Gym Slot</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Reserve your workout time to guarantee entry.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-xs text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Date Selector */}
      <div className="flex items-center space-x-4 bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
        <Calendar className="h-5 w-5 text-[#c1ff00]" />
        <div className="flex flex-col">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Select Date</label>
          <input 
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]} // Cannot book past dates
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Slots List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Available Slots</h2>
          {loading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[#111111] rounded-xl"></div>)}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No active slots found.</div>
          ) : (
            <div className="space-y-3">
              {slots.map(slot => {
                const isFull = slot.bookedCount >= slot.capacity;
                const available = slot.capacity - slot.bookedCount;
                
                return (
                  <div key={slot._id} className="bg-[#111111]/60 border border-white/10 rounded-xl p-4 flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-white">{slot.slotName}</h3>
                        <p className="text-xs text-[#c1ff00] font-semibold">{slot.startTime} - {slot.endTime}</p>
                      </div>
                      <button
                        onClick={() => handleBook(slot._id)}
                        disabled={isFull || bookingLoading || hasBookingOnSelectedDate}
                        className={`text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors ${
                          isFull || hasBookingOnSelectedDate
                            ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-orange-500 text-zinc-950 hover:bg-orange-600'
                        }`}
                      >
                        {isFull ? 'Full' : hasBookingOnSelectedDate ? 'Limit Reached' : 'Book'}
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
                        <span>{slot.bookedCount} / {slot.capacity} Booked</span>
                        <span>{available} Seats Left</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getOccupancyColor(slot.bookedCount, slot.capacity)} transition-all duration-500`} 
                          style={{ width: `${(slot.bookedCount / slot.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Booking History */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">My Bookings</h2>
          {bookings.length === 0 ? (
            <div className="bg-[#111111]/30 border border-white/10 rounded-xl p-6 text-center text-gray-500 text-sm">
              You haven't made any bookings yet.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(booking => {
                const bDate = new Date(booking.date).toLocaleDateString();
                const isUpcoming = new Date(booking.date) >= new Date(new Date().setHours(0,0,0,0)) && booking.status === 'booked';
                
                return (
                  <div key={booking._id} className="bg-[#111111]/60 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white">{booking.slot?.slotName || 'Deleted Slot'}</h4>
                      <p className="text-[11px] text-gray-400">{bDate} | {booking.slot?.startTime} - {booking.slot?.endTime}</p>
                      <div className="mt-1">
                        {booking.status === 'booked' && <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold border border-emerald-500/20">Confirmed</span>}
                        {booking.status === 'cancelled' && <span className="text-[9px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full uppercase font-bold border border-red-500/20">Cancelled</span>}
                        {booking.status === 'completed' && <span className="text-[9px] bg-zinc-500/10 text-gray-400 px-2 py-0.5 rounded-full uppercase font-bold border border-zinc-500/20">Completed</span>}
                      </div>
                    </div>
                    {isUpcoming && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                        title="Cancel Booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
