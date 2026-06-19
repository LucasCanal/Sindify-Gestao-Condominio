import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Car,
  Package,
  Bell,
  Wallet,
  CalendarCheck,
  Wrench,
  ShieldCheck,
  Vote,
} from 'lucide-react'

const MENU_ITEMS = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Apartamentos',  icon: Building2,        path: '/apartments' },
  { label: 'Veículos',      icon: Car,               path: '/vehicles' },
  { label: 'Encomendas',    icon: Package,           path: '/packages' },
  { label: 'Avisos',        icon: Bell,              path: '/notices' },
  { label: 'Finanças',      icon: Wallet,            path: '/finances' },
  { label: 'Reservas',      icon: CalendarCheck,     path: '/bookings' },
  { label: 'Chamados',      icon: Wrench,            path: '/service-requests' },
  { label: 'Acessos',       icon: ShieldCheck,       path: '/access' },
  { label: 'Votações',      icon: Vote,              path: '/votes' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside style={{
      width: '232px',
      flexShrink: 0,
      minHeight: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #ece9f5',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '0 8px', marginBottom: '32px' }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: '30px',
          height: '34px',
          background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #1e1b4b 100%)',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '19px', fontStyle: 'italic', fontFamily: 'sans-serif', transform: 'translateX(-1px)' }}>S</span>
        </div>
        <span style={{ color: '#1e1b4b', fontWeight: '600', fontSize: '18px', letterSpacing: '-0.5px' }}>
          Sindify<span style={{ fontWeight: '400', color: '#6b7280' }}>Gestão</span>
        </span>
      </div>

      {/* Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {MENU_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: active ? 'rgba(124,58,237,0.08)' : 'transparent',
                color: active ? '#6d28d9' : '#6b7280',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
                width: '100%',
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#374151' } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280' } }}
            >
              <Icon size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span>{label}</span>
              {active && (
                <span style={{
                  marginLeft: 'auto',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#7c3aed',
                  flexShrink: 0
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Rodapé da sidebar */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f0f7', marginTop: '16px' }}>
        <p style={{ fontSize: '11px', color: '#9ca3af', padding: '0 8px', margin: 0 }}>
          Sindify Gestão © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  )
}