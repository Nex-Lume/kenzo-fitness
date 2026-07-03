import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [revRes, memRes] = await Promise.all([
          api.get('/reports/revenue?format=json'),
          api.get('/reports/members?format=json')
        ]);
        
        if (revRes.data.success) setRevenueData(revRes.data.data);
        if (memRes.data.success) setMembersData(memRes.data.data);
      } catch (err) {
        setError('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = async (endpoint, format) => {
    try {
      // In a real app, you would use window.open or fetch as blob
      window.open(`http://localhost:5000/api/reports/${endpoint}?format=${format}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Loading Reports...</div>;

  // Chart configuration
  const revenueChartData = {
    labels: revenueData.slice(0, 10).map(d => d.Date),
    datasets: [{
      label: 'Revenue',
      data: revenueData.slice(0, 10).map(d => d.Amount),
      backgroundColor: 'rgba(249, 115, 22, 0.5)',
      borderColor: 'rgba(249, 115, 22, 1)',
      borderWidth: 1,
    }]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Analytics & Reports</h1>
          <p className="text-xs text-gray-500 mt-1">Export your data to CSV or PDF.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111111]/30 border border-zinc-900 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Revenue</h2>
            <div className="space-x-2">
              <button onClick={() => handleExport('revenue', 'csv')} className="px-3 py-1 bg-white/5 text-xs text-white rounded hover:bg-zinc-700">CSV</button>
              <button onClick={() => handleExport('revenue', 'pdf')} className="px-3 py-1 bg-orange-500/20 text-xs text-[#c1ff00] border border-orange-500/50 rounded hover:bg-orange-500/30">PDF</button>
            </div>
          </div>
          <div className="h-64">
            <Bar data={revenueChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-[#111111]/30 border border-zinc-900 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">Members Directory</h2>
            <div className="space-x-2">
              <button onClick={() => handleExport('members', 'csv')} className="px-3 py-1 bg-white/5 text-xs text-white rounded hover:bg-zinc-700">CSV</button>
              <button onClick={() => handleExport('members', 'pdf')} className="px-3 py-1 bg-orange-500/20 text-xs text-[#c1ff00] border border-orange-500/50 rounded hover:bg-orange-500/30">PDF</button>
            </div>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-gray-500 sticky top-0">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {membersData.map((m, i) => (
                  <tr key={i}>
                    <td className="p-3">{m.Name}</td>
                    <td className="p-3">{m.Plan}</td>
                    <td className="p-3">{m.Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
