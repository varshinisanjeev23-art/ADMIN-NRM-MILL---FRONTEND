import { useEffect, useState } from 'react';
import api from '../services/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      const url = filter ? `/admin/bookings?status=${filter}` : '/admin/bookings';
      const res = await api.get(url);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      loadBookings();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const statusColor = (status) => {
    if (status === 'delivered') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'shipped') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (status === 'out_for_delivery') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (status === 'processing') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (status === 'pending') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-rose-100 text-rose-700 border-rose-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Operations</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Booking Management</h1>
          <p className="text-slate-600">Filter, review, and update booking statuses quickly.</p>
        </header>

        <div className="flex flex-wrap gap-3 items-center">
          <label className="text-sm font-semibold text-slate-700">Filter by status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-200 px-4 py-2 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wide">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Rice Type</th>
                  <th className="p-4 text-left">Quantity</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4 font-semibold">{b.user?.name || 'N/A'}</td>
                    <td className="p-4 text-slate-600">{b.riceType}</td>
                    <td className="p-4 text-slate-600">{b.quantityKg}kg</td>
                    <td className="p-4 font-semibold text-slate-900">₹{b.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b._id, e.target.value)}
                        className="border border-slate-200 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      {(b.product?._id || b.product) && (
                        <button
                          onClick={() => {
                            const productId = b.product?._id || b.product;
                            const CLIENT_URL = 'http://localhost:5174';
                            window.open(`${CLIENT_URL}/products/p/${productId}?tab=Reviews&writeReview=true`, '_blank');
                          }}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1 whitespace-nowrap"
                          title="View & write review for this product"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                          Review
                        </button>
                      )}
                    </td>
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
