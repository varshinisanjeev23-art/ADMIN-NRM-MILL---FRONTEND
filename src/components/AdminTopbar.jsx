import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

export default function AdminTopbar() {
  const { admin, logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shadow-sm">
      <Link to="/admin/dashboard" className="flex items-center gap-2 text-slate-900 font-extrabold text-xl">
        <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow">
          NRM
        </span>
        <span>NRM Rice Mill Admin</span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-slate-800">{admin?.name || 'Admin'}</span>
          <span className="text-xs text-slate-500">Logged in</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:shadow-md transition-transform transform-gpu hover:-translate-y-0.5"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
