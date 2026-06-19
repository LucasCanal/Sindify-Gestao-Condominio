import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <header style={{
        width: '100%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #4d1d956c',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: '"Poppins", sans-serif'
      }}>
        {/* Mudamos para width 100% e aumentamos o padding para respirar nas pontas */}
        <div style={{
          width: '100%',
          padding: '0 120px', 
          height: '95px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          
          {/* ── LOGO (Extrema Esquerda) ── */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '34px',
              height: '38px',
              background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #1e1b4b 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)'
            }}>
              <span style={{ color: '#ffffff', fontWeight: '900', fontSize: '22px', fontStyle: 'italic', fontFamily: 'sans-serif', transform: 'translateX(-1px)' }}>S</span>
            </div>
            
            <span style={{ color: '#1e1b4b', fontWeight: '600', fontSize: '26px', letterSpacing: '-0.8px' }}>
              Sindify<span style={{ fontWeight: '400', color: '#1e1b4b' }}>Gestão</span>
            </span>
          </div>

          {/* ── MENUS DE NAVEGAÇÃO (Centralizado no espaço restante) ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}> {/* Aumentei o espaço (gap) entre os links */}
            {[
              { label: 'Home', url: '#' },
              { label: 'Sobre o Sindify', url: '#sobre' },
              { label: 'Funcionalidades', url: '#funcionalidades' },
              { label: 'Planos e Preços', url: '#planos' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.url}
                style={{
                  color: '#1e1b4b',
                  fontSize: '19px',
                  fontWeight: '400',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.color = '#4c1d95'}
                onMouseLeave={(e) => e.target.style.color = '#1e1b4b'}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* ── BOTÕES E LOGIN (Extrema Direita) ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'linear-gradient(180deg, #f97316 0%, #e65f05 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.95';
                  e.target.style.boxShadow = '0 6px 16px rgba(249, 115, 22, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.boxShadow = '0 4px 12px rgba(249, 115, 22, 0.15)';
                }}
              >
                Acesso Condômino
              </button>
            </div>

            <button 
              style={{
                background: 'none',
                border: 'none',
                color: '#1e1b4b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4c1d95'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1e1b4b'}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

          </div>

        </div>
      </header>

      {/* ── ICONE FLUTUANTE DO WHATSAPP ── */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25d366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'transform 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onClick={() => window.open('https://wa.me/seu-numero', '_blank')}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="#ffffff">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.002-2.634-1.023-5.11-2.885-6.974C16.58 1.86 14.108.835 11.483.833 6.049.833 1.625 5.245 1.622 10.68c-.001 1.666.449 3.292 1.302 4.707l-.992 3.623 3.715-.974zm11.21-6.914c-.304-.153-1.8-.886-2.077-.988-.278-.102-.48-.153-.682.153-.202.304-.783.988-.96 1.192-.177.204-.355.229-.659.076-1.076-.538-1.794-.963-2.506-2.186-.188-.323.188-.3.538-.999.051-.102.025-.19-.013-.266-.038-.076-.325-.783-.445-1.072-.117-.282-.236-.243-.324-.248-.083-.004-.178-.005-.273-.005-.096 0-.253.036-.386.183-.133.147-.507.495-.507 1.207s.518 1.397.59 1.497c.072.102 1.019 1.557 2.47 2.186.345.15.614.24.824.307.347.111.663.095.912.058.278-.041.886-.362 1.012-.711.127-.35.127-.649.089-.711-.038-.063-.152-.102-.456-.256z"/>
        </svg>
      </div>
    </>
  );
}