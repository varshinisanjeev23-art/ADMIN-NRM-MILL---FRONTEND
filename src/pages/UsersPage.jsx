import { useEffect, useState } from 'react';
import api from '../services/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', company: '', role: 'user' });

  const load = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users', { params: { q: query } });
      setUsers(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  const startEdit = (u) => {
    setEditing(u.id);
    setForm({ name: u.name, email: u.email, company: u.company || '', role: u.role || 'user' });
  };

  const saveEdit = async () => {
    try {
      await api.patch(`/admin/users/${editing}`, form);
      setEditing(null);
      load(q);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save user');
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load(q);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
          <p className="text-slate-500">Manage registered customers</p>
        </div>
      </header>

      <section className="bg-white rounded-2xl shadow p-4 border border-slate-200">
        <form onSubmit={onSearch} className="flex items-center gap-3">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, company"
            className="flex-1 border-2 border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700">Search</button>
        </form>
      </section>

      {error && (
        <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-xl">{error}</div>
      )}

      <section className="bg-white rounded-2xl shadow overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Name</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Email</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Company</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Role</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Joined</th>
                <th className="text-left px-6 py-3 text-slate-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-6 text-center text-slate-500">Loading users…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-6 text-center text-slate-500">No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-3 font-semibold text-slate-900">
                      {editing === u.id ? (
                        <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="border border-slate-200 rounded px-2 py-1" />
                      ) : (
                        u.name
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {editing === u.id ? (
                        <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="border border-slate-200 rounded px-2 py-1" />
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-700">
                      {editing === u.id ? (
                        <input value={form.company} onChange={(e)=>setForm({...form,company:e.target.value})} className="border border-slate-200 rounded px-2 py-1" />
                      ) : (
                        u.company
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {editing === u.id ? (
                        <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="border border-slate-200 rounded px-2 py-1">
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-700">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3 flex gap-2">
                      {editing === u.id ? (
                        <>
                          <button onClick={saveEdit} className="px-3 py-1 rounded bg-emerald-600 text-white text-sm">Save</button>
                          <button onClick={()=>setEditing(null)} className="px-3 py-1 rounded border border-slate-300 text-sm">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={()=>startEdit(u)} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Edit</button>
                          <button onClick={()=>deleteUser(u.id)} className="px-3 py-1 rounded bg-rose-600 text-white text-sm">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
