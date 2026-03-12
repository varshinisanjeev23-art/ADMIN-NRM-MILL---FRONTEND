import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ bookings: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      try {
        const bookings = await api.get('/admin/bookings');
        const payments = await api.get('/admin/payments');

        const totalBookings = bookings.data.length;
        const totalRevenue = payments.data.reduce((sum, p) => sum + (p.status === 'success' ? p.amount : 0), 0);
        const pendingBookings = bookings.data.filter((b) => b.status === 'pending').length;

        setStats({ bookings: totalBookings, revenue: totalRevenue, pending: pendingBookings });
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold">Admin Overview</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Live snapshot of bookings, revenue, and pending orders.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">Total Bookings</span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">Today</span>
            </div>
            <p className="text-4xl font-extrabold text-blue-700">{stats.bookings}</p>
            <p className="text-slate-500 text-sm mt-2">Across all processes</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">Total Revenue</span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">Success</span>
            </div>
            <p className="text-4xl font-extrabold text-emerald-700">₹{stats.revenue}</p>
            <p className="text-slate-500 text-sm mt-2">Successful payments only</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">Pending Orders</span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">Action</span>
            </div>
            <p className="text-4xl font-extrabold text-amber-700">{stats.pending}</p>
            <p className="text-slate-500 text-sm mt-2">Awaiting confirmation</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Processing Pipeline</h3>
              <span className="text-xs text-slate-500">Live</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Intake → Cleaning</span>
                <div className="h-2 w-40 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-blue-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Husking → Polishing</span>
                <div className="h-2 w-40 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-indigo-500"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Grading → Packaging</span>
                <div className="h-2 w-40 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Alerts</h3>
              <span className="text-xs text-amber-600 font-semibold">Actions Needed</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-amber-600 font-bold">•</span>
                Pending bookings require review and assignment.
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-blue-600 font-bold">•</span>
                Verify latest payments exported to accounting.
              </li>
              <li className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-emerald-600 font-bold">•</span>
                Confirm completion updates for in-progress dye lots.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
