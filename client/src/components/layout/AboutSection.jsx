import React from 'react';

export default function AboutSection() {
  return (
    <section style={{
      width: '100%',
      padding: '100px 60px',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #fdf4ff 100%)',
      color: '#1e1b4b',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '80px',
        flexWrap: 'wrap'
      }}>

        {/* Texto */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '520px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#7c3aed',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'block'
          }}>
            Tecnologia para Condomínios
          </span>

          <h2 style={{ fontSize: '42px', fontWeight: '400', lineHeight: '1.2', marginBottom: '24px', color: '#1e1b4b' }}>
            <span style={{ color: '#7c3aed' }}>Aqui no Sindify</span>{' '}
            é gestão com inteligência e transparência
          </h2>

          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8', marginBottom: '36px', maxWidth: '440px' }}>
            Nossa plataforma foi criada para simplificar o dia a dia de síndicos e moradores, 
            centralizando comunicação, finanças e manutenção em um único lugar — com segurança e praticidade.
          </p>

          <a href="#" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#7c3aed',
            fontWeight: '600',
            fontSize: '15px',
            textDecoration: 'none',
            borderBottom: '2px solid #7c3aed',
            paddingBottom: '2px'
          }}>
            Conheça nossas soluções
            <span style={{ fontSize: '18px' }}>↗</span>
          </a>
        </div>

        {/* Card visual */}
        <div style={{
          flex: '1',
          minWidth: '300px',
          maxWidth: '520px',
          borderRadius: '32px 32px 32px 8px',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 80px rgba(124, 58, 237, 0.25)'
        }}>

          {/* Círculo decorativo */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(167, 139, 250, 0.15)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-30px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(167, 139, 250, 0.08)',
          }} />

          {/* Métricas */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(167, 139, 250, 0.2)'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#a78bfa', marginBottom: '4px' }}>98%</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>Satisfação dos síndicos</div>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(167, 139, 250, 0.2)'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '600', color: '#a78bfa', marginBottom: '4px' }}>+2k</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: '1.4' }}>Condomínios ativos</div>
            </div>
          </div>

          {/* Lista de features */}
          {[
            { icon: '🏢', text: 'Gestão financeira automatizada' },
            { icon: '💬', text: 'Comunicação centralizada com moradores' },
            { icon: '🔧', text: 'Controle de manutenções e chamados' },
            { icon: '📊', text: 'Relatórios e transparência total' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              position: 'relative',
              zIndex: 1
            }}>
              <span style={{
                fontSize: '18px',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(167, 139, 250, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>{item.icon}</span>
              <span style={{ fontSize: '14px', color: '#e5e7eb', fontWeight: '500' }}>{item.text}</span>
              <span style={{ marginLeft: 'auto', color: '#a78bfa', fontSize: '16px' }}>✓</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}