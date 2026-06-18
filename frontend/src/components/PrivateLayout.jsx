import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function PrivateLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--private-bg)',
        color: 'var(--outline)',
        fontSize: 16,
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ background: 'var(--private-bg)', minHeight: '100vh', color: '#ffffff' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, padding: 32, minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
