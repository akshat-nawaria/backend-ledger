import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, ArrowLeftRight, Trash2 } from 'lucide-react';
import { accountAPI } from '../services/api';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
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

  const handleCreateAccount = async (e) => {
    e?.preventDefault();
    if (!newAccountName.trim()) return;
    
    setCreating(true);
    try {
      await accountAPI.create({ name: newAccountName });
      await loadAccounts();
      setShowModal(false);
      setNewAccountName('');
    } catch (err) {
      console.error('Failed to create account:', err);
    }
    setCreating(false);
  };

  const handleCloseAccount = async (accountId) => {
    if (!window.confirm("Are you sure you want to close this account? You must have a zero balance to do this.")) return;
    try {
      await accountAPI.delete(accountId);
      await loadAccounts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to close account.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getAccountColor = (index) => {
    const colors = ['#635BFF', '#f97316', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];
    return colors[index % colors.length];
  };

  const getStatusBadge = (status) => {
    const map = {
      ACTIVE: 'badge-active',
      FROZEN: 'badge-frozen',
      CLOSED: 'badge-closed',
    };
    return map[status] || 'badge-pending';
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--outline)' }}>Loading accounts...</div>;
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>My Accounts</h1>
          <p style={{ color: 'var(--outline)', fontSize: 14 }}>Manage your digital ledgers and liquidity assets.</p>
        </div>
        <button onClick={() => setShowModal(true)} disabled={creating} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13, borderRadius: 'var(--radius)' }}>
          <Plus size={16} /> {creating ? 'Creating...' : 'Open new account'}
        </button>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="card-private" style={{ padding: 64, textAlign: 'center' }}>
          <p style={{ color: 'var(--outline)', fontSize: 16, marginBottom: 16 }}>You don't have any accounts yet.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '12px 32px' }}>
            <Plus size={16} /> Create your first account
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {accounts.map((acct, i) => {
            const color = getAccountColor(i);
            const balance = balances[acct._id] || 0;

            return (
              <div key={acct._id} className="card-private" style={{ padding: 24 }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: `${color}20`, border: `1px solid ${color}50`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 16, color,
                    }}>
                      {(acct.name || 'A').charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{acct.name || 'Standard Account'}</div>
                      <div style={{ fontSize: 12, color: 'var(--outline)' }}>ID: XXXX-XXXX-{acct._id.slice(-4)}</div>
                    </div>
                  </div>
                  <span className={`badge ${getStatusBadge(acct.status)}`}>{acct.status}</span>
                </div>

                {/* Balance */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: 'var(--outline)', marginBottom: 4 }}>Current balance</div>
                  <div className="tabular-nums" style={{ fontSize: 28, fontWeight: 700 }}>{formatCurrency(balance)}</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12 }}>
                  {acct.status === 'ACTIVE' ? (
                    <>
                      <button onClick={() => navigate('/transfer', { state: { fromAccount: acct._id } })} style={{
                        flex: 1, padding: '10px', borderRadius: 'var(--radius)',
                        background: 'var(--primary)', color: 'var(--on-primary)',
                        fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}>
                        <ArrowLeftRight size={14} /> Transfer
                      </button>
                      <button onClick={() => handleCloseAccount(acct._id)} style={{
                        padding: '10px', borderRadius: 'var(--radius)',
                        background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose)',
                        border: '1px solid rgba(244, 63, 94, 0.2)',
                        fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)'}
                      title="Close Account"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button style={{
                      flex: 1, padding: '10px', borderRadius: 'var(--radius)',
                      border: '1px solid var(--private-border)', color: 'var(--outline)',
                      fontSize: 13, fontWeight: 500,
                    }}>
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="card-private" style={{
        marginTop: 32,
        padding: 48,
        background: 'linear-gradient(135deg, var(--private-card) 0%, rgba(99, 91, 255, 0.05) 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Master your double-entry tracking.</h3>
          <p style={{ color: 'var(--outline)', fontSize: 14, maxWidth: 480 }}>
            LedgerX provides high-fidelity transaction logging with cryptographic verification. Secure your assets with enterprise-grade vaults.
          </p>
        </div>
        <div style={{
          width: 200, height: 120, background: 'var(--private-bg)',
          border: '1px solid var(--private-border)', borderRadius: 'var(--radius)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          </div>
        </div>
      </div>

      {/* Create Account Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(11, 15, 26, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card-private fade-in" style={{ width: 400, padding: 32, border: '1px solid var(--primary-accent)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Open New Account</h3>
            <p style={{ color: 'var(--outline)', fontSize: 14, marginBottom: 24 }}>Give your new ledger a recognizable name.</p>
            
            <form onSubmit={handleCreateAccount}>
              <div style={{ marginBottom: 24 }}>
                <label className="text-label" style={{ color: 'var(--outline)', display: 'block', marginBottom: 8 }}>Account Name</label>
                <input 
                  autoFocus
                  className="input-private" 
                  placeholder="e.g. Operating Fund, Payroll Reserve" 
                  value={newAccountName}
                  onChange={e => setNewAccountName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost-dark" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={!newAccountName.trim() || creating} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
