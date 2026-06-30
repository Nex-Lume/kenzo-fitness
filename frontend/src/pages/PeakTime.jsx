import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Activity, Clock, Users } from 'lucide-react';

const PeakTime = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeakTime = async () => {
      try {
        const res = await api.get('/dashboard/peak-time');
        if (res.data.success) {
          setSlots(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch peak time data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeakTime();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Peak': return 'bg-red-500 text-red-100';
      case 'Medium': return 'bg-amber-500 text-amber-950';
      default: return 'bg-emerald-500 text-emerald-950';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Peak': return 'bg-red-500/10 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Peak': return 'text-red-400';
      case 'Medium': return 'text-amber-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 py-8 md:px-0">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center justify-center space-x-3">
          <Activity className="h-8 w-8 md:h-10 md:w-10 text-orange-500" />
          <span>Gym Crowd Forecast</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Check today's real-time gym occupancy to plan your workout at the perfect time.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div 
              key={slot._id} 
              className={`rounded-2xl border p-6 flex flex-col space-y-4 ${getStatusBgColor(slot.status)} transition-transform hover:scale-[1.02]`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{slot.slotName}</h3>
                  <div className="flex items-center space-x-1.5 text-zinc-400 text-xs mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-semibold">{slot.startTime} - {slot.endTime}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(slot.status)}`}>
                  {slot.status}
                </span>
              </div>
              
              <div className="flex items-end justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Occupancy</span>
                  <span className={`text-2xl font-black ${getStatusTextColor(slot.status)}`}>
                    {Math.round(slot.occupancy)}%
                  </span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Booked</span>
                  <div className="flex items-center space-x-1.5 text-zinc-300 font-semibold">
                    <Users className="h-4 w-4" />
                    <span>{slot.bookedCount} / {slot.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="w-full bg-zinc-950/50 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${getStatusColor(slot.status)}`} 
                  style={{ width: `${Math.min(100, slot.occupancy)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeakTime;
