import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PublicNavbar() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--outline-variant)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <div className="container-max" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link to="/" style={{ fontSize: 28, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
            LedgerX
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="hide-mobile">
            {['Products', 'Solutions', 'Resources', 'Pricing'].map(item => (
              <a key={item} href="#" style={{
                fontSize: 14,
                color: 'var(--on-surface-variant)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--on-surface-variant)'}
              >{item}</a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/login" style={{
            fontSize: 14,
            color: 'var(--on-surface-variant)',
            padding: '8px 16px',
            transition: 'color 0.2s',
          }}>Log in</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>
            Open account <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
