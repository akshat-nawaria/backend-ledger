import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <main style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left: Form */}
      <section style={{
        width: '50%',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '64px',
      }}>
        <div style={{ maxWidth: 440, width: '100%' }} className="fade-in">
          <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--on-surface)', marginBottom: 32, letterSpacing: '-0.02em' }}>
            LedgerX
          </div>

          <h2 className="text-section" style={{ marginBottom: 8 }}>Welcome back</h2>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>
            Sign in to access your ledger and manage your finances.
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius)',
              color: 'var(--rose)',
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="text-label" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Email Address</label>
              <input className="input-public" type="email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="text-label" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-public"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--on-surface-variant)',
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius)',
              fontSize: 15,
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--on-surface-variant)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create one</Link>
          </p>
        </div>
      </section>

      {/* Right: Aurora Visuals */}
      <section className="aurora-bg" style={{
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
          <div style={{ position: 'absolute', top: -96, left: -96, width: 384, height: 384, background: 'rgba(79, 55, 138, 0.3)', borderRadius: '50%', filter: 'blur(100px)' }} />
          <div style={{ position: 'absolute', bottom: -96, right: -96, width: 384, height: 384, background: 'rgba(201, 167, 77, 0.2)', borderRadius: '50%', filter: 'blur(100px)' }} />

          <div className="glass-card fade-in" style={{ borderRadius: 16, padding: 40, boxShadow: '0 24px 48px rgba(0,0,0,0.3)', position: 'relative', zIndex: 20, textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99, 91, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Shield size={40} color="#635BFF" />
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 16 }}>Enterprise-Grade Security</h3>
            <p style={{ color: 'var(--outline)', fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>
              Your financial data is protected with ACID-compliant transactions, immutable audit trails, and token-based authentication.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <Lock size={18} />, label: 'JWT Token Authentication' },
                { icon: <Shield size={18} />, label: 'Immutable Ledger Entries' },
                { icon: <ArrowRight size={18} />, label: 'Idempotent Transfers' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ color: '#635BFF' }}>{item.icon}</div>
                  <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
