import { useState, useEffect } from 'react';
import api from '../services/api';

export default function CareersAdminPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/careers/applications');
      setApplications(res.data);
    } catch (e) {
      setError('Failed to load applications');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const getResumeUrl = (path) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Job Applications</h1>
          <p className="text-slate-500">Manage recruitment and candidate resumes</p>
        </div>
        <button 
          onClick={loadApplications}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          Refresh List
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 p-4 rounded-2xl text-center">
          {error}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <p className="text-slate-400 text-lg">No job applications received yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{app.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {app.position}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {app.email}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {app.phone || 'N/A'}
                  </div>
                </div>
                {app.message && (
                  <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100 italic text-slate-700">
                    "{app.message}"
                  </div>
                )}
                <div className="text-xs text-slate-400">
                  Applied on: {new Date(app.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="md:w-48 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                <a 
                  href={getResumeUrl(app.resumePath)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Resume
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
