import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown, User as UserIcon } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const ROLE_LABELS = {
  sindico: 'Síndico',
  morador: 'Morador',
  porteiro: 'Porteiro',
  zelador: 'Zelador',
  conselheiro: 'Conselheiro',
}

export default function DashboardHeader() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = (user?.name || '?')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <header style={{
      width: '100%',
      height: '64px',
      background: '#ffffff',
      borderBottom: '1px solid #ece9f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 8px',
            borderRadius: '8px',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            flexShrink: 0,
          }}>
            {initials || <UserIcon size={15} />}
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1e1b4b', lineHeight: '1.2' }}>
              {user?.name || 'Usuário'}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', lineHeight: '1.2' }}>
              {ROLE_LABELS[user?.role] || user?.role || ''}
            </p>
          </div>
          <ChevronDown size={15} color="#9ca3af" style={{ marginLeft: '2px', transform: menuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 6px)',
            minWidth: '180px',
            background: '#ffffff',
            border: '1px solid #ece9f5',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(30,27,75,0.08)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => { setMenuOpen(false); navigate('/profile') }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                color: '#374151',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <UserIcon size={15} />
              Meu perfil
            </button>
            <button
              onClick={() => { setMenuOpen(false); logout() }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid #f1f0f7',
                color: '#ef4444',
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}