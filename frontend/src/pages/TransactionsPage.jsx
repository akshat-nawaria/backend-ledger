import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { transactionAPI } from '../services/api';

export default function TransactionsPage() {
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLedgers();
  }, []);

  const loadLedgers = async () => {
    try {
      const res = await transactionAPI.getAll();
      setLedgers(res.data.ledgers || []);
    } catch (err) {
      console.error('Failed to load ledgers:', err);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />;
      case 'FAILED':
      case 'REVERSED': return <XCircle size={16} style={{ color: 'var(--rose)' }} />;
      default: return <Clock size={16} style={{ color: 'var(--amber)' }} />;
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--outline)' }}>Loading ledger...</div>;
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>Ledger Entries</h1>
        <p style={{ color: 'var(--outline)', fontSize: 14 }}>Immutable record of all your account debits and credits.</p>
      </div>

      <div className="card-private" style={{ overflow: 'hidden' }}>
        {ledgers.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--outline)' }}>
            No ledger entries found. Make a transfer to see it here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-private">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Account ID</th>
                  <th>Transaction ID</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ledgers.map((ledger) => {
                  const tx = ledger.transaction;
                  const isCredit = ledger.type === 'CREDIT';
                  return (
                    <tr key={ledger._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: isCredit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {isCredit ? <ArrowDownLeft size={14} style={{ color: 'var(--emerald)' }} /> : <ArrowUpRight size={14} style={{ color: 'var(--rose)' }} />}
                          </div>
                          <span style={{ fontWeight: 600, color: isCredit ? 'var(--emerald)' : 'var(--rose)' }}>
                            {ledger.type}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--outline)' }}>
                        •••• {ledger.account.slice(-4)}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--outline)' }}>
                        {tx ? tx.idempotencyKey.slice(0, 13) + '...' : 'N/A'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {getStatusIcon(tx?.status)}
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{tx?.status || 'UNKNOWN'}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--outline)' }}>
                        {formatDate(tx?.createdAt || new Date())}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: isCredit ? 'var(--emerald)' : 'var(--rose)' }} className="tabular-nums">
                        {isCredit ? '+' : '-'}{formatCurrency(ledger.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
