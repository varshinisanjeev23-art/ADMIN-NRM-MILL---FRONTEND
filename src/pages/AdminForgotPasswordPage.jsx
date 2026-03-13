import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ ok: false, message: '', debugLink: '', previewUrl: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setStatus({ 
        ok: true, 
        message: response.data.message,
        debugLink: response.data.debugLink,
        previewUrl: response.data.previewUrl
      });
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.message || 'Failed to send reset link' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg font-bold">NRM ADMIN</div>
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Recovery</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your staff email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Staff Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              placeholder="admin@nrm-mill.com"
            />
          </div>

          {status.message && (
            <div className="space-y-4">
              <div className={`${status.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'} border-2 px-4 py-3 rounded-xl text-sm font-semibold`}>
                {status.message}
              </div>

              {status.previewUrl && (
                <div className="bg-blue-50 border-blue-200 border-2 px-4 py-4 rounded-xl text-sm shadow-sm transition-all animate-pulse">
                  <p className="text-blue-800 font-bold mb-2">Test Email (Admin) Sent!</p>
                  <a href={status.previewUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Open Admin Inbox ↗
                  </a>
                </div>
              )}

              {status.debugLink && (
                <div className="bg-amber-50 border-amber-200 border-2 px-4 py-3 rounded-xl text-xs">
                  <p className="text-amber-800 font-bold mb-1">Admin Reset Link:</p>
                  <a href={status.debugLink} className="text-blue-600 break-all underline hover:text-blue-800 font-mono">
                    {status.debugLink}
                  </a>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send Recovery Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/admin/login" className="text-blue-600 font-bold hover:underline text-sm tracking-wide">← Back to Admin Login</Link>
        </div>
      </div>
    </div>
  );
}
