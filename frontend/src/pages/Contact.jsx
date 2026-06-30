import React, { useState } from 'react';
import api from '../api/axios';
import Toast from '../components/Toast';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/contact', formData);
      if (response.data.success) {
        setSuccessMsg(response.data.message);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-black tracking-wider text-zinc-100 mb-2">Contact Us</h1>
        <p className="text-zinc-400 mb-8">We'd love to hear from you. Send us a message below.</p>

        <ErrorMessage message={error} />
        {successMsg && <Toast message={successMsg} type="success" onClose={() => setSuccessMsg('')} />}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-300 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                placeholder="How can we help?"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-300 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
