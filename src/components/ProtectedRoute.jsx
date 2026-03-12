import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!admin) return <Navigate to="/admin/login" />;

  return children;
}
