import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { DollarSign, ShieldAlert, Search, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_STYLES = {
  successful: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  failed: "bg-red-500/10 text-red-400 border border-red-500/20",
  created: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
};

const STATUS_ICON = {
  successful: CheckCircle,
  failed: XCircle,
  created: Clock,
};

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    let result = payments;
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.memberId?.fullName?.toLowerCase().includes(q) ||
          p.invoiceNumber?.toLowerCase().includes(q) ||
          p.orderId?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [payments, search, statusFilter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment/all");
      if (res.data.success) setPayments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load payment records.");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === "successful")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const successCount = payments.filter((p) => p.status === "successful").length;
  const failedCount = payments.filter((p) => p.status === "failed").length;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-950/40 border-t-violet-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">Payment Records</h1>
        <p className="text-xs text-slate-500 mt-1">All member payment transactions and invoices.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-indigo-950/40 bg-[#111827]/40 p-6 flex items-center space-x-4 shadow">
          <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
            <DollarSign className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Revenue</p>
            <p className="text-2xl font-black text-white mt-0.5">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-indigo-950/40 bg-[#111827]/40 p-6 flex items-center space-x-4 shadow">
          <div className="rounded-xl bg-violet-500/10 p-3 border border-violet-500/20">
            <CheckCircle className="h-6 w-6 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Successful</p>
            <p className="text-2xl font-black text-white mt-0.5">{successCount}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-indigo-950/40 bg-[#111827]/40 p-6 flex items-center space-x-4 shadow">
          <div className="rounded-xl bg-red-500/10 p-3 border border-red-500/20">
            <XCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Failed</p>
            <p className="text-2xl font-black text-white mt-0.5">{failedCount}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center space-x-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by member name or invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-indigo-950/40 bg-[#090d16] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-indigo-950/40 bg-[#090d16] px-4 py-2.5 text-xs text-white outline-none focus:border-violet-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="successful">Successful</option>
          <option value="created">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="rounded-2xl border border-indigo-950/40 bg-[#111827]/40 overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0c1122] text-slate-500 uppercase text-[10px] font-bold tracking-widest border-b border-indigo-950/40">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Member</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-950/30 text-slate-300">
            {filtered.map((p) => {
              const StatusIcon = STATUS_ICON[p.status] || Clock;
              const statusClass = STATUS_STYLES[p.status] || "bg-slate-500/10 text-slate-400 border border-slate-500/20";
              return (
                <tr key={p._id} className="hover:bg-[#111827]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-3.5 w-3.5 text-slate-600" />
                      <span className="font-mono text-xs text-slate-400">
                        {p.invoiceNumber || p.orderId?.slice(0, 16) || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-white">{p.memberId?.fullName || "—"}</td>
                  <td className="p-4 text-slate-400">{p.planId?.name || "—"}</td>
                  <td className="p-4 font-bold text-emerald-400">${p.amount?.toLocaleString() || "0"}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${statusClass}`}>
                      <StatusIcon className="h-3 w-3" />
                      <span>{p.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                      : "—"}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-500 text-xs">
                  <DollarSign className="h-8 w-8 mx-auto mb-3 text-slate-700" />
                  {payments.length === 0 ? "No payment records found yet." : "No records match your search or filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
