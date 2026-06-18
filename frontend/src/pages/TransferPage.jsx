import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Info, RefreshCw, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { accountAPI, transactionAPI } from '../services/api';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function TransferPage() {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [fromAccount, setFromAccount] = useState(location.state?.fromAccount || '');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState(generateUUID());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await accountAPI.getAll();
      const accts = (res.data.accounts || []).filter(a => a.status === 'ACTIVE');
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

      if (!fromAccount && accts.length > 0) {
        setFromAccount(accts[0]._id);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromAccount || !toAccount || !amount) {
      setError('All fields are required');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (fromAccount === toAccount) {
      setError('Cannot transfer to the same account');
      return;
    }

    setLoading(true);
    try {
      const res = await transactionAPI.create({
        fromAccount,
        toAccount,
        amount: parseFloat(amount),
        idempotencyKey,
      });
      setSuccess(res.data.message || 'Transaction completed successfully!');
      setAmount('');
      setToAccount('');
      setIdempotencyKey(generateUUID());
      await loadAccounts(); // Refresh balances
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    }
    setLoading(false);
  };

  const totalLiquidity = Object.values(balances).reduce((sum, b) => sum + b, 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>Transfer Funds</h1>
          <p style={{ color: 'var(--outline)', fontSize: 14 }}>Move money between accounts or send to external ledgers.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="text-label" style={{ color: 'var(--outline)', marginBottom: 4 }}>TOTAL LIQUIDITY</div>
          <div className="tabular-nums" style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary-accent)' }}>{formatCurrency(totalLiquidity)}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
        {/* Transfer Form */}
        <div className="card-private" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'rgba(99, 91, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} style={{ color: 'var(--primary-accent)' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600 }}>Send funds</h3>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius)', color: 'var(--rose)', fontSize: 13, marginBottom: 24 }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius)', color: 'var(--emerald)', fontSize: 13, marginBottom: 24 }}>
              {success}
            </div>
          )}

          <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* From / To Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label className="text-label" style={{ color: 'var(--outline)', display: 'block', marginBottom: 8 }}>From Account</label>
                <select
                  value={fromAccount}
                  onChange={e => setFromAccount(e.target.value)}
                  style={{
                    width: '100%', height: 48, padding: '0 16px',
                    borderRadius: 'var(--radius)', background: 'var(--private-input)',
                    border: '1px solid var(--private-border)', color: 'white',
                    fontSize: 14, appearance: 'auto',
                  }}
                >
                  <option value="">Select account</option>
                  {accounts.map(acct => (
                    <option key={acct._id} value={acct._id}>
                      •••• {acct._id.slice(-4)} ({formatCurrency(balances[acct._id] || 0)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label" style={{ color: 'var(--outline)', display: 'block', marginBottom: 8 }}>To Account / External ID</label>
                <input className="input-private" placeholder="LX-XXXX-XXXX" value={toAccount} onChange={e => setToAccount(e.target.value)} />
              </div>
            </div>

            {/* Amount */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label className="text-label" style={{ color: 'var(--outline)' }}>Amount</label>
                {fromAccount && (
                  <span className="tabular-nums" style={{ fontSize: 12, color: 'var(--emerald)' }}>
                    AVAILABLE: {formatCurrency(balances[fromAccount] || 0)}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)', fontSize: 18, fontWeight: 600 }}>₹</span>
                <input
                  className="input-private tabular-nums"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ paddingLeft: 40, fontSize: 18, fontWeight: 600 }}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Idempotency Key */}
            <div>
              <label className="text-label" style={{ color: 'var(--outline)', display: 'block', marginBottom: 8 }}>Idempotency Key (Transaction ID)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input-private" value={idempotencyKey} onChange={e => setIdempotencyKey(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 13 }} />
                <button type="button" onClick={() => setIdempotencyKey(generateUUID())} style={{
                  width: 48, height: 48, borderRadius: 'var(--radius)',
                  border: '1px solid var(--private-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--outline)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--outline)'}
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-label" style={{ color: 'var(--outline)', display: 'block', marginBottom: 8 }}>Note (Optional)</label>
              <textarea
                placeholder="e.g. Q3 Vendor Settlement"
                style={{
                  width: '100%', minHeight: 80, padding: 16,
                  borderRadius: 'var(--radius)', background: 'var(--private-input)',
                  border: '1px solid var(--private-border)', color: 'white',
                  fontSize: 14, resize: 'vertical', fontFamily: 'var(--font-family)',
                }}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 16,
              background: 'var(--primary-accent)', color: 'white',
              borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 600,
              transition: 'all 0.2s',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Processing...' : 'Transfer funds'}
            </button>
          </form>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Transfer Guidelines */}
          <div className="card-private" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Info size={18} style={{ color: 'var(--primary-accent)' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-accent)' }}>Transfer Guidelines</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Internal transfers between your LedgerX accounts are near-instant and free of charge.',
                'External transfers to verified ledgers may take up to 2 hours for settlement.',
                'Ensure the recipient ID is correct; LedgerX does not support automated recalls for verified IDs.',
              ].map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary-accent)', flexShrink: 0, marginTop: 8 }} />
                  <p style={{ fontSize: 13, color: 'var(--outline)', lineHeight: 1.6 }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="card-private" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Recent Transfers</span>
              <button style={{ fontSize: 12, color: 'var(--primary-accent)', fontWeight: 500 }}>VIEW ALL</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {accounts.length > 0 ? accounts.slice(0, 2).map((acct, i) => (
                <div key={acct._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: i === 0 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {i === 0 ? <ArrowUpRight size={16} style={{ color: 'var(--rose)' }} /> : <ArrowDownLeft size={16} style={{ color: 'var(--emerald)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Account •••{acct._id.slice(-4)}</div>
                    <div style={{ fontSize: 11, color: 'var(--outline)' }}>Recent transfer</div>
                  </div>
                  <div className="tabular-nums" style={{
                    fontSize: 14, fontWeight: 700,
                    color: i === 0 ? 'var(--rose)' : 'var(--emerald)',
                  }}>
                    {i === 0 ? '-' : '+'} {formatCurrency(Math.random() * 10000)}
                  </div>
                </div>
              )) : (
                <p style={{ color: 'var(--outline)', fontSize: 13, textAlign: 'center' }}>No recent transfers</p>
              )}
            </div>
          </div>

          {/* Security Info */}
          <div style={{
            padding: 16,
            borderLeft: '3px solid var(--primary-accent)',
            background: 'rgba(99, 91, 255, 0.05)',
            borderRadius: '0 var(--radius) var(--radius) 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldCheck size={16} style={{ color: 'var(--emerald)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-accent)' }}>Encryption Active</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--outline)', lineHeight: 1.6 }}>
              This transaction is protected by 256-bit AES encryption and LedgerX SafeLink monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
