import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const navItems = ['Home', 'Sobre o Sindify', 'Funcionalidades', 'Planos e Preços', 'Contato'];

  return (
    <footer style={{
      width: '100%',
      padding: '80px 60px',
      background: 'linear-gradient(135deg, #0b071e 0%, #1e1b4b 100%)',
      color: '#ffffff',
      borderTop: '1px solid rgba(167, 139, 250, 0.2)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '60px',
        alignItems: 'flex-start'
      }}>

        {/* Logo e descrição */}
        <div style={{ flex: '1', minWidth: '220px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '16px' }}>
            Sindify<span style={{ color: '#a78bfa' }}>.</span>
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6', maxWidth: '260px' }}>
            Transformando a gestão condominial com tecnologia, transparência e eficiência.
          </p>
        </div>

        {/* Newsletter — centralizado */}
        <div style={{ flex: '2', minWidth: '320px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#a78bfa', marginBottom: '12px', lineHeight: '1.4' }}>
            Assine a Newsletter: Notícias e Insights de Tecnologia e Inovação
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
            Receba conteúdos exclusivos sobre tendências de mercado e insights estratégicos direto no seu e-mail.
          </p>
          <div style={{ display: 'flex', gap: '0', maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Escreva seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 18px',
                background: '#1a1a2e',
                border: '1px solid rgba(167, 139, 250, 0.2)',
                borderRight: 'none',
                borderRadius: '6px 0 0 6px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button style={{
              padding: '14px 24px',
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0 6px 6px 0',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea580c'}
              onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
            >
              Inscrever
            </button>
          </div>
        </div>

        {/* Navegação e Social */}
        <div style={{ flex: '1', display: 'flex', gap: '60px', justifyContent: 'flex-end' }}>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '20px' }}>Navegação</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navItems.map((item) => (
                <li
                  key={item}
                  style={{
                    color: '#9ca3af',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'color 0.2s, transform 0.2s',
                    display: 'inline-block'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = '#a78bfa';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '20px' }}>Social</h4>
            <div style={{ display: 'flex', gap: '16px' }}>

              {/* Instagram */}
              <a
                href="#"
                style={{ display: 'flex', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  const svg = e.currentTarget.querySelector('svg');
                  svg.style.stroke = '#a78bfa';
                  svg.querySelector('circle:last-child').style.fill = '#a78bfa';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const svg = e.currentTarget.querySelector('svg');
                  svg.style.stroke = '#9ca3af';
                  svg.querySelector('circle:last-child').style.fill = '#9ca3af';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s' }}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#9ca3af" stroke="none" style={{ transition: 'fill 0.2s' }} />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                style={{ display: 'flex', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.querySelector('svg').style.stroke = '#a78bfa';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.querySelector('svg').style.stroke = '#9ca3af';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s' }}>
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '60px',
        paddingTop: '30px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        color: '#4b5563',
        fontSize: '12px'
      }}>
        © 2026 Sindify Gestão Condominial. Todos os direitos reservados.
      </div>
    </footer>
  );
}