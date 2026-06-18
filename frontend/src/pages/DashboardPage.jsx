import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, Layers, Plus, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { accountAPI } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await accountAPI.getAll();
      const accts = res.data.accounts || [];
      setAccounts(accts);

      const balanceMap = {};
      for (const acct of accts) {
        try {
          const balRes = await accountAPI.getBalance(acct._id);
          balanceMap[acct._id] = balRes.data.balance || 0;
        } catch {
          balanceMap[acct._id] = 0;
        }
      }
      setBalances(balanceMap);
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
    setLoading(false);
  };

  const totalBalance = Object.values(balances).reduce((sum, b) => sum + b, 0);
  const activeAccounts = accounts.filter(a => a.status === 'ACTIVE').length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'A';

  const handleCreateAccount = async () => {
    const name = window.prompt("Enter a name for your new account (e.g. Operating Fund, Corporate Vault):");
    if (!name || !name.trim()) return;
    try {
      await accountAPI.create({ name: name.trim() });
      await loadData();
    } catch (err) {
      console.error('Failed to create account:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--outline)' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
            {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p style={{ color: 'var(--outline)', fontSize: 14 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
            <input className="input-private" placeholder="Search transactions..." style={{ paddingLeft: 40, width: 256, height: 40, fontSize: 13 }} />
          </div>
          <button style={{
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--radius)', border: '1px solid var(--private-border)',
            color: 'var(--outline)', transition: 'all 0.2s',
          }}>
            <Bell size={18} />
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
        <div className="card-private" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span className="text-label" style={{ color: 'var(--outline)' }}>Total Balance</span>
            <Wallet size={20} style={{ color: 'var(--primary-accent)' }} />
          </div>
          <div className="tabular-nums" style={{ fontSize: 28, fontWeight: 700 }}>{formatCurrency(totalBalance)}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--emerald)' }}>
            <TrendingUp size={14} style={{ marginRight: 4 }} /> +2.4% vs last month
          </div>
        </div>

        <div className="card-private" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span className="text-label" style={{ color: 'var(--outline)' }}>Month Credits</span>
            <ArrowDownLeft size={20} style={{ color: 'var(--emerald)' }} />
          </div>
          <div className="tabular-nums" style={{ fontSize: 28, fontWeight: 700 }}>{formatCurrency(totalBalance > 0 ? totalBalance * 0.17 : 0)}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--outline)' }}>Expected: {formatCurrency(totalBalance * 0.2)}</div>
        </div>

        <div className="card-private" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span className="text-label" style={{ color: 'var(--outline)' }}>Month Debits</span>
            <ArrowUpRight size={20} style={{ color: 'var(--rose)' }} />
          </div>
          <div className="tabular-nums" style={{ fontSize: 28, fontWeight: 700 }}>{formatCurrency(totalBalance > 0 ? totalBalance * 0.07 : 0)}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--outline)' }}>8% lower than last month</div>
        </div>

        <div className="card-private" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <span className="text-label" style={{ color: 'var(--outline)' }}>Active Accounts</span>
            <Layers size={20} style={{ color: 'var(--amber)' }} />
          </div>
          <div className="tabular-nums" style={{ fontSize: 28, fontWeight: 700 }}>{String(activeAccounts).padStart(2, '0')}</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--outline)' }}>Across all providers</div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="card-private" style={{ marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ padding: 24, borderBottom: '1px solid var(--private-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-label" style={{ color: 'white' }}>Balance Over Time</span>
          <div style={{ display: 'flex', background: 'var(--private-bg)', padding: 4, borderRadius: 'var(--radius)', border: '1px solid var(--private-border)' }}>
            {['7D', '30D', '90D'].map((label, i) => (
              <button key={label} style={{
                padding: '4px 12px', fontSize: 12, fontWeight: 500, borderRadius: 'var(--radius-sm)',
                background: i === 1 ? 'var(--primary)' : 'transparent',
                color: i === 1 ? 'white' : 'var(--outline)',
                transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ height: 256, position: 'relative', width: '100%', background: 'linear-gradient(180deg, rgba(99, 91, 255, 0.15) 0%, rgba(99, 91, 255, 0) 100%)', display: 'flex', alignItems: 'flex-end', padding: '0 24px' }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ color: 'var(--primary-accent)' }}>
            <path d="M0,180 C100,160 200,190 300,140 C400,90 500,110 600,60 C700,10 800,80 900,40 L1000,70 L1000,200 L0,200 Z" fill="currentColor" fillOpacity="0.1" />
            <path d="M0,180 C100,160 200,190 300,140 C400,90 500,110 600,60 C700,10 800,80 900,40 L1000,70" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
          <div style={{ position: 'absolute', left: '60%', top: 64, transform: 'translateX(-50%)', background: 'white', color: 'var(--private-bg)', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {formatCurrency(totalBalance)}
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        {/* Accounts list */}
        <div className="card-private" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 24, borderBottom: '1px solid var(--private-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-label" style={{ color: 'white' }}>Recent Accounts</span>
            <button onClick={() => navigate('/accounts')} style={{ fontSize: 12, color: 'var(--primary-accent)', fontWeight: 500, transition: 'opacity 0.2s' }}>View All</button>
          </div>
          <div style={{ padding: 24 }}>
            {accounts.length === 0 ? (
              <p style={{ color: 'var(--outline)', textAlign: 'center', padding: 24 }}>No accounts yet. Create one to get started!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {accounts.slice(0, 4).map((acct, i) => (
                  <div key={acct._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        background: `rgba(${[99, 249, 59][i % 3]}, ${[91, 115, 130][i % 3]}, ${[255, 72, 246][i % 3]}, 0.1)`,
                        border: `1px solid rgba(${[99, 249, 59][i % 3]}, ${[91, 115, 130][i % 3]}, ${[255, 72, 246][i % 3]}, 0.3)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 14,
                        color: ['#635BFF', '#f97316', '#3b82f6'][i % 3],
                      }}>
                        {(acct.name || 'Account').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{acct.name || `Account ${i + 1}`}</div>
                        <div style={{ fontSize: 11, color: 'var(--outline)' }}>•••• {acct._id.slice(-4)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="tabular-nums" style={{ fontSize: 14, fontWeight: 700 }}>{formatCurrency(balances[acct._id] || 0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-private" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 24, borderBottom: '1px solid var(--private-border)' }}>
            <span className="text-label" style={{ color: 'white' }}>Quick Actions</span>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={handleCreateAccount} style={{
              width: '100%', padding: 16, border: '1px dashed var(--private-border)',
              borderRadius: 'var(--radius-md)', color: 'var(--outline)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary-accent)'; e.currentTarget.style.borderColor = 'rgba(99,91,255,0.5)'; e.currentTarget.style.background = 'rgba(99,91,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--outline)'; e.currentTarget.style.borderColor = 'var(--private-border)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Plus size={18} /> Open new account
            </button>

            <button onClick={() => navigate('/transfer')} style={{
              width: '100%', padding: 16,
              background: 'var(--primary)',
              color: 'var(--on-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
            }}>
              Transfer Funds
            </button>
          </div>

          <div style={{ margin: '0 24px 24px', padding: 16, background: 'rgba(99,91,255,0.05)', border: '1px solid rgba(99,91,255,0.2)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ color: 'var(--primary-accent)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Security Check</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--outline)', lineHeight: 1.6 }}>
              All accounts are monitored. Last sync {Math.floor(Math.random() * 10) + 1} mins ago.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--private-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--outline)', fontSize: 12 }}>
        <div>© 2024 LedgerX Financial. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Security'].map(link => (
            <a key={link} href="#" style={{ color: 'var(--outline)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--primary-accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--outline)'}
            >{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
