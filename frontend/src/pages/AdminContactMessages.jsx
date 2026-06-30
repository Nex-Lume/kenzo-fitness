import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Mail, Trash2, CheckCircle, RefreshCcw, Eye } from 'lucide-react';
import Toast from '../components/Toast';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contact');
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.put(`/contact/${id}/status`, { status });
      if (response.data.success) {
        setToastMsg('Status updated successfully');
        setMessages((prev) =>
          prev.map((msg) => (msg._id === id ? { ...msg, status } : msg))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      setToastMsg('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const response = await api.delete(`/contact/${id}`);
      if (response.data.success) {
        setToastMsg('Message deleted successfully');
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
      }
    } catch (err) {
      setToastMsg('Failed to delete message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-wider text-zinc-100">Contact Messages</h1>
          <p className="text-zinc-400">View and manage messages from the public website</p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg transition-all"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <ErrorMessage message={error} />
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 ? (
        <EmptyState message="No contact messages found" icon={Mail} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950 rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="overflow-y-auto flex-1">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 border-b border-zinc-800 cursor-pointer transition-colors ${
                    selectedMessage?._id === msg._id
                      ? 'bg-orange-500/10 border-l-4 border-l-orange-500'
                      : 'hover:bg-zinc-900 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-zinc-200 truncate pr-2">{msg.name}</h3>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      msg.status === 'new' ? 'bg-emerald-500/20 text-emerald-400' :
                      msg.status === 'read' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate">{msg.subject}</p>
                  <p className="text-[10px] text-zinc-500 mt-2">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 border border-zinc-800 bg-zinc-950 rounded-xl p-6 h-[600px] overflow-y-auto">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                      <span>{selectedMessage.name}</span>
                      <span>•</span>
                      <a href={`mailto:${selectedMessage.email}`} className="text-orange-500 hover:underline">
                        {selectedMessage.email}
                      </a>
                      <span>•</span>
                      <a href={`tel:${selectedMessage.phone}`} className="text-orange-500 hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="p-2 text-zinc-500 hover:text-red-500 bg-zinc-900 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <p className="text-zinc-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                <div className="border-t border-zinc-800 pt-6 flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage._id, 'read')}
                    disabled={selectedMessage.status === 'read'}
                    className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Eye className="w-4 h-4" /> Mark as Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                    disabled={selectedMessage.status === 'replied'}
                    className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark as Replied
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <Mail className="w-16 h-16 mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
