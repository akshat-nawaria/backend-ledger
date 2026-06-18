import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Receipt, ArrowLeftRight, FileText, Settings, HelpCircle, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Building2, label: 'Accounts' },
  { to: '/transactions', icon: FileText, label: 'Transactions' },
  { to: '/transfer', icon: ArrowLeftRight, label: 'Transfer' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div style={{
        fontSize: 28,
        fontWeight: 900,
        color: 'var(--primary)',
        padding: '0 16px',
        marginBottom: 24,
        letterSpacing: '-0.02em',
      }}>
        LedgerX
      </div>

      {/* New Entry Button */}
      <button
        onClick={() => navigate('/transfer')}
        style={{
          margin: '0 16px 24px',
          padding: '12px 16px',
          background: 'var(--primary)',
          color: 'var(--on-primary)',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
      >
        <Plus size={18} /> New Entry
      </button>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div style={{ borderTop: '1px solid rgba(122,117,130,0.2)', paddingTop: 16 }}>
        <a href="#" className="sidebar-link">
          <HelpCircle size={20} />
          <span>Help Center</span>
        </a>

        {/* User Info */}
        <div style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 8,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--primary)',
            color: 'var(--on-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 16,
          }}>
            {getInitial(user?.name)}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontWeight: 700,
              fontSize: 14,
              color: 'var(--on-surface)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.name || 'User'}
            </div>
            <div style={{
              fontSize: 10,
              color: 'var(--outline)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.email || ''}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            style={{ color: 'var(--outline)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--rose)'}
            onMouseLeave={e => e.target.style.color = 'var(--outline)'}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
