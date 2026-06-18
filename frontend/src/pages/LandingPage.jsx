import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import { ArrowRight, ChevronRight, BookOpen, Zap, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--surface)' }}>
      <PublicNavbar />

      {/* ── Hero Section ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 700,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div className="aurora-mesh" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.6,
        }} />
        <div className="container-max fade-in" style={{ position: 'relative', zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(103, 80, 164, 0.1)',
              border: '1px solid rgba(103, 80, 164, 0.2)',
              marginBottom: 24,
            }}>
              <span className="text-label" style={{ color: 'var(--primary)' }}>Double-entry. Rock solid.</span>
            </div>

            <h1 className="text-hero" style={{ color: 'var(--on-surface)', marginBottom: 24 }}>
              Financial infrastructure<br />
              for <span className="gradient-text">your money.</span>
            </h1>

            <p className="text-body" style={{
              color: 'var(--on-surface-variant)',
              fontSize: 18,
              maxWidth: 560,
              opacity: 0.8,
              marginBottom: 32,
            }}>
              Move capital with full ACID compliance and zero drift. Build scalable ledgering systems, automate idempotent transfers, and gain real-time visibility into every transaction — from your first million to your billionth.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 14 }}>
                Create account <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 14 }}>
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{
        background: 'var(--surface-container-low)',
        borderTop: '1px solid rgba(203, 196, 210, 0.3)',
        borderBottom: '1px solid rgba(203, 196, 210, 0.3)',
      }}>
        <div className="container-max" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 32,
          padding: '24px var(--margin-desktop)',
        }}>
          {[
            { label: 'ACID TRANSACTIONS', value: '100% Guaranteed' },
            { label: 'IMMUTABLE LEDGER', value: 'SHA-256 Chained' },
            { label: 'IDEMPOTENT TRANSFERS', value: 'Safety First' },
            { label: 'REAL-TIME BALANCES', value: '<5ms Latency' },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="text-label" style={{ color: 'var(--outline)', marginBottom: 4 }}>{stat.label}</span>
              <span style={{ fontSize: 18, fontWeight: 700 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" style={{ padding: '96px 0', background: 'var(--surface)' }}>
        <div className="container-max">
          <div style={{ marginBottom: 64, maxWidth: 600 }}>
            <h2 className="text-section" style={{ marginBottom: 16 }}>Precision at every scale.</h2>
            <p className="text-body" style={{ color: 'var(--on-surface-variant)', fontSize: 18 }}>
              Our core engine is built for the complexity of modern financial flows, handling high-concurrency without ever losing a cent.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--gutter)' }}>
            {[
              {
                icon: <BookOpen size={24} />,
                title: 'Double-Entry Bookkeeping',
                desc: 'The gold standard of accounting baked into the API level. Every debit has a corresponding credit, ensuring mathematical balance across all accounts.',
              },
              {
                icon: <Zap size={24} />,
                title: 'Extreme Concurrency',
                desc: 'Process thousands of simultaneous transfers to the same account without locking issues or race conditions. Built for peak loads.',
              },
              {
                icon: <ShieldCheck size={24} />,
                title: 'Zero Balance Drift',
                desc: 'Our immutable audit trail ensures that balances are always derived from transaction history, preventing any possibility of data corruption.',
              },
            ].map((feature, i) => (
              <div key={i} className="card-public" style={{ cursor: 'default' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: 'rgba(79, 55, 138, 0.1)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 24,
                  color: 'var(--primary)',
                  transition: 'transform 0.3s',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{feature.title}</h3>
                <p className="text-body" style={{ color: 'var(--on-surface-variant)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section (Dark Zone) ── */}
      <section style={{ padding: '96px 0', background: '#0A2540', color: 'white', overflow: 'hidden', position: 'relative' }}>
        <div className="container-max" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 className="text-section" style={{ marginBottom: 24 }}>Ready to get started?</h2>
              <p style={{ color: 'var(--outline)', fontSize: 18, marginBottom: 32, maxWidth: 480, lineHeight: 1.7 }}>
                Explore our developer documentation or create a sandbox account to start building your financial ecosystem in minutes.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                <Link to="/register" className="btn btn-accent" style={{ padding: '16px 40px' }}>
                  Get Started Now <ChevronRight size={18} />
                </Link>
                <a href="#" className="btn btn-ghost-dark" style={{ padding: '16px 40px' }}>
                  Talk to an expert
                </a>
              </div>
            </div>

            {/* Code Block */}
            <div style={{
              background: '#1C2333',
              border: '1px solid #2D3748',
              borderRadius: 'var(--radius-md)',
              padding: 32,
              fontFamily: 'monospace',
              fontSize: 14,
              boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ marginLeft: 16, color: '#6b7280' }}>ledgerx-sdk-v4.2</span>
              </div>
              <div style={{ color: '#60a5fa' }}>const <span style={{ color: '#34d399' }}>ledger</span> = <span style={{ color: '#60a5fa' }}>new</span> LedgerX({'{'}</div>
              <div style={{ paddingLeft: 16, color: '#a78bfa' }}>apiKey: <span style={{ color: '#fb923c' }}>'lx_prod_...7a2'</span>,</div>
              <div style={{ paddingLeft: 16, color: '#a78bfa' }}>idempotencyKey: <span style={{ color: '#fb923c' }}>'tx_9821'</span></div>
              <div style={{ color: '#60a5fa' }}>{'}'});</div>
              <div style={{ marginTop: 16, color: '#60a5fa' }}>await <span style={{ color: '#34d399' }}>ledger</span>.transfers.create({'{'}</div>
              <div style={{ paddingLeft: 16, color: '#a78bfa' }}>amount: <span style={{ color: '#fb923c' }}>500000</span>, <span style={{ color: '#6b7280' }}>// $5,000.00</span></div>
              <div style={{ paddingLeft: 16, color: '#a78bfa' }}>currency: <span style={{ color: '#fb923c' }}>'USD'</span>,</div>
              <div style={{ paddingLeft: 16, color: '#a78bfa' }}>source: <span style={{ color: '#fb923c' }}>'acct_ext_1'</span>,</div>
              <div style={{ paddingLeft: 16, color: '#a78bfa' }}>destination: <span style={{ color: '#fb923c' }}>'acct_int_2'</span></div>
              <div style={{ color: '#60a5fa' }}>{'}'});</div>
              <div style={{ marginTop: 24, color: '#6b7280', fontStyle: 'italic' }}>// Response: 201 Created. ACID compliant.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: '48px 0',
        background: 'var(--surface-container-low)',
        borderTop: '1px solid var(--outline-variant)',
      }}>
        <div className="container-max" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 24,
        }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>LedgerX</div>
            <p style={{ color: 'var(--outline)', fontSize: 14, marginTop: 4 }}>Built for the next generation of finance.</p>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Privacy Policy', 'Terms of Service', 'Security', 'Status'].map(link => (
              <a key={link} href="#" style={{ color: 'var(--outline)', fontSize: 14, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--outline)'}
              >{link}</a>
            ))}
          </div>
          <div style={{ color: 'var(--outline)', fontSize: 14 }}>
            © 2024 LedgerX Financial. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
