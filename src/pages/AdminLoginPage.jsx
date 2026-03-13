import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';
import { GoogleLogin } from '@react-oauth/google';


export default function AdminLoginPage() {
  const { login, googleLogin } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('varshinithiyagarajan552@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-extrabold shadow-xl">
            NRM
          </div>
          <h1 className="text-3xl font-extrabold mt-4 text-slate-900">Admin Console</h1>
          <p className="text-slate-500 text-sm">Secure access for staff</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              placeholder="varshinithiyagarajan552@gmail.com"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-transform transform-gpu hover:-translate-y-0.5"
          >
            Sign In
          </button>
          <div className="text-right">
            <a href="/admin/forgot-password" the title="Forgot Admin Password" className="text-blue-600 text-xs font-semibold hover:underline">Forgot password?</a>
          </div>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-white text-slate-500 uppercase tracking-widest">Staff Auth</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Auth Failed')}
            theme="outline"
            shape="pill"
            size="large"
            text="signin_with"
            width="400"
          />
        </div>
      </div>

    </div>
  );
}
