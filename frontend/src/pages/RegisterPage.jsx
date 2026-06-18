import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Plus, Minus, Wallet, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const getStrength = (val) => {
    let s = 0;
    if (val.length > 5) s += 25;
    if (val.length > 8) s += 25;
    if (/[A-Z]/.test(val)) s += 25;
    if (/[0-9]/.test(val)) s += 25;
    return s;
  };

  const strength = getStrength(password);
  const strengthLabel = strength <= 25 ? 'Weak' : strength <= 75 ? 'Moderate' : 'Secure';
  const strengthColor = strength <= 25 ? 'var(--rose)' : strength <= 75 ? 'var(--amber)' : 'var(--emerald)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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

          <h2 className="text-section" style={{ marginBottom: 8 }}>Create your account</h2>
          <p className="text-body" style={{ color: 'var(--on-surface-variant)', marginBottom: 32 }}>
            Enter your details to start managing your corporate finances.
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
              <label className="text-label" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Full Name</label>
              <input className="input-public" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>

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
              {/* Strength Bar */}
              <div style={{ marginTop: 8, width: '100%', height: 4, background: 'var(--surface-variant)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${strength}%`, height: '100%', background: strengthColor, borderRadius: 2, transition: 'all 0.3s' }} />
              </div>
              <p style={{ fontSize: 10, color: 'var(--on-surface-variant)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Password Strength: <span style={{ color: strengthColor }}>{strengthLabel}</span>
              </p>
            </div>

            <div>
              <label className="text-label" style={{ color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input-public"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--on-surface-variant)',
                }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--on-surface-variant)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link>
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
        <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
          {/* Blurred bg elements */}
          <div style={{
            position: 'absolute', top: -96, left: -96,
            width: 384, height: 384,
            background: 'rgba(79, 55, 138, 0.3)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }} />
          <div style={{
            position: 'absolute', bottom: -96, right: -96,
            width: 384, height: 384,
            background: 'rgba(201, 167, 77, 0.2)',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }} />

          {/* Glass Card */}
          <div className="glass-card fade-in" style={{
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            position: 'relative',
            zIndex: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 600, color: 'white' }}>Recent Transactions</h3>
                <p style={{ fontSize: 12, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Live Network Feed</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(79, 55, 138, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color="white" fill="white" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <Plus size={20} />, name: 'Stripe Payout', sub: 'Merchant ID: 9942', amount: '+$12,450.00', color: 'var(--emerald)', bg: 'rgba(16, 185, 129, 0.2)' },
                { icon: <Minus size={20} />, name: 'AWS Infrastructure', sub: 'Service Fee', amount: '-$1,240.22', color: 'var(--rose)', bg: 'rgba(244, 63, 94, 0.2)' },
                { icon: <Wallet size={20} />, name: 'Internal Transfer', sub: 'Vault A → Operating', amount: '+$5,000.00', color: 'var(--emerald)', bg: 'rgba(16, 185, 129, 0.2)' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 16, borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  opacity: 1 - i * 0.15,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontWeight: 500 }}>{item.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--outline)' }}>{item.sub}</p>
                    </div>
                  </div>
                  <p style={{ color: item.color, fontFamily: 'monospace', fontWeight: 700 }}>{item.amount}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: 12, color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 700 }}>Total Operating Capital</p>
                <p style={{ fontSize: 30, color: 'white', fontWeight: 900, letterSpacing: '-0.02em', marginTop: 4 }}>$1,660,264.40</p>
              </div>
              <svg width="96" height="48" viewBox="0 0 100 40" style={{ color: 'var(--emerald)', overflow: 'visible' }}>
                <path d="M0 35 Q 25 30, 40 20 T 70 10 T 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                <circle cx="100" cy="5" fill="currentColor" r="3" />
              </svg>
            </div>
          </div>

          {/* Floating accent */}
          <div className="glass-card" style={{
            position: 'absolute', bottom: -40, left: -40,
            padding: 16, borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 30,
            transform: 'rotate(6deg) scale(0.9)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="pulse-glow" style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--emerald)' }} />
              <span style={{ color: 'white', fontSize: 12, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>System Nominal 99.9%</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
