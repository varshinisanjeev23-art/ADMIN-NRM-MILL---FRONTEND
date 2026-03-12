import { useEffect, useState } from 'react';
import api from '../services/api';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      const url = filter ? `/admin/payments?status=${filter}` : '/admin/payments';
      const res = await api.get(url);
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to load payments', err);
    }
  };

  const downloadPDF = async (range = 'daily') => {
    try {
      const res = await api.get(`/reports/transactions?range=${range}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${range}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download PDF', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'success') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'failed') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Finance</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Transactions</h1>
          <p className="text-slate-600">Review payments, filter by status, and export PDFs instantly.</p>
        </header>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold text-slate-700">Filter by status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-200 px-4 py-2 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Transactions</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={() => downloadPDF('daily')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow hover:shadow-lg"
          >
            Download Daily PDF
          </button>
          <button
            onClick={() => downloadPDF('monthly')}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow hover:shadow-lg"
          >
            Download Monthly PDF
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Order ID</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {payments.map((p) => (
                  <tr key={p._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-semibold">{p.user?.name || 'N/A'}</td>
                    <td className="p-4 font-semibold text-slate-900">₹{p.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{p.razorpayOrderId || 'N/A'}</td>
                    <td className="p-4 text-sm text-slate-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
