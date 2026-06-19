import React, { useState } from 'react';

const testimonials = [
  {
    id: 1,
    quote: 'O Sindify transformou completamente a gestão do nosso condomínio. Antes levávamos horas para fechar as contas do mês, hoje tudo é automático e transparente. Os moradores confiam muito mais na administração.',
    name: 'Fernanda Oliveira',
    role: 'Síndica Profissional',
    company: 'Condomínio Vista Verde — São Paulo',
    initials: 'FO',
    color: '#7c3aed',
  },
  {
    id: 2,
    quote: 'A funcionalidade de assembleias digitais foi um divisor de águas. Conseguimos atingir 85% de participação dos condôminos na última votação, algo que jamais acontecia nas reuniões presenciais. Recomendo demais.',
    name: 'Ricardo Mendes',
    role: 'Administrador de Condomínios',
    company: 'Residencial Parque das Flores — Campinas',
    initials: 'RM',
    color: '#a78bfa',
  },
  {
    id: 3,
    quote: 'Gerencio 12 condomínios e o Sindify centralizou tudo em um só lugar. O controle financeiro, os chamados de manutenção e a comunicação com os moradores ficaram muito mais ágeis. Economizei pelo menos 3 horas por dia.',
    name: 'Patrícia Costa',
    role: 'Síndica Profissional',
    company: 'Torres do Atlântico — Santos',
    initials: 'PC',
    color: '#8b5cf6',
  },
];

export default function Avaliation() {
  const [active, setActive] = useState(null);

  return (
    <section style={{
      width: '100%',
      padding: '100px 60px',
      background: '#0b071e',
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px' }}>
          <span style={{
            fontSize: '25px',
            fontWeight: '600',
            color: '#6b7280',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}>
            O que falam sobre o:
          </span>
          <span style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#a78bfa',
            letterSpacing: '0.02em',
            display: 'block',
          }}>
            Sindify Gestão Condominial
          </span>
        </div>

        {/* Testimonials */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              onMouseEnter={() => setActive(t.id)}
              onMouseLeave={() => setActive(null)}
              style={{
                padding: '48px 0',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                borderBottom: i === testimonials.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
            >
              {/* Quote */}
              <p style={{
                fontSize: '22px',
                fontWeight: '400',
                color: active === t.id ? '#ffffff' : '#d1d5db',
                lineHeight: '1.7',
                marginBottom: '28px',
                transition: 'color 0.3s ease',
                maxWidth: '820px',
              }}>
                <span style={{
                  color: active === t.id ? t.color : '#4b5563',
                  fontFamily: 'Georgia, serif',
                  fontSize: '32px',
                  lineHeight: '0',
                  verticalAlign: '-10px',
                  marginRight: '4px',
                  transition: 'color 0.3s ease',
                }}>"</span>
                {t.quote}
                <span style={{
                  color: active === t.id ? t.color : '#4b5563',
                  fontFamily: 'Georgia, serif',
                  fontSize: '32px',
                  lineHeight: '0',
                  verticalAlign: '-10px',
                  marginLeft: '4px',
                  transition: 'color 0.3s ease',
                }}>"</span>
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Avatar */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: active === t.id
                    ? `linear-gradient(135deg, ${t.color}, #1e1b4b)`
                    : 'linear-gradient(135deg, #1e1b4b, #2d2a4a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: active === t.id ? '#ffffff' : '#6b7280',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                  border: active === t.id ? `2px solid ${t.color}` : '2px solid transparent',
                }}>
                  {t.initials}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: active === t.id ? t.color : '#9ca3af',
                      transition: 'color 0.3s ease',
                    }}>
                      {t.name}
                    </span>
                    <span style={{ color: '#374151', fontSize: '12px' }}>—</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{t.role}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '2px' }}>
                    {t.company}
                  </div>
                </div>

                {/* Linha decorativa que cresce no hover */}
                <div style={{
                  marginLeft: 'auto',
                  height: '1px',
                  width: active === t.id ? '80px' : '0px',
                  background: t.color,
                  transition: 'width 0.4s ease',
                  borderRadius: '99px',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '64px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex' }}>
            {['FO', 'RM', 'PC'].map((init, i) => (
              <div key={i} style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, #4c1d95, #7c3aed)`,
                border: '2px solid #0b071e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '700',
                color: '#e9d5ff',
                marginLeft: i === 0 ? '0' : '-10px',
                zIndex: 3 - i,
                position: 'relative',
              }}>{init}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#e5e7eb' }}>
              +500 síndicos satisfeitos
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              em todo o Brasil
            </div>
          </div>
          <a href="#" style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'transparent',
            border: '1px solid rgba(167, 139, 250, 0.3)',
            borderRadius: '8px',
            color: '#a78bfa',
            fontSize: '13px',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(167,139,250,0.1)';
              e.currentTarget.style.borderColor = '#a78bfa';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.3)';
            }}
          >
            Ver todos os depoimentos ↗
          </a>
        </div>

      </div>
    </section>
  );
}