import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ ok: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus({ ok: false, message: 'Passwords do not match' });
      return;
    }
    const validatePassword = (pw) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return regex.test(pw);
    };

    if (!validatePassword(password)) {
      setStatus({ 
        ok: false, 
        message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.' 
      });
      return;
    }

    setLoading(true);
    setStatus({ ok: false, message: '' });
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus({ ok: true, message: 'Admin password updated! Redirecting to login...' });
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      setStatus({ ok: false, message: err.response?.data?.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-blue-600 text-white mb-4 shadow-lg font-bold">NRM ADMIN</div>
          <h1 className="text-3xl font-extrabold text-slate-900">New Password</h1>
          <p className="text-slate-500 text-sm mt-2">Set a new secure password for your staff account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              placeholder="••••••••"
            />
          </div>

          {status.message && (
            <div className={`${status.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'} border-2 px-4 py-3 rounded-xl text-sm font-semibold`}>
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Set Admin Password'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/admin/login" className="text-blue-600 font-bold hover:underline text-sm tracking-wide">Back to Sign In</Link>
        </div>
      </div>
    </div>
  );
}
