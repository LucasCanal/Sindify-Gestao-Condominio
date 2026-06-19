import React from 'react';

const posts = [
  {
    id: 1,
    tag: 'Financeiro',
    title: 'Inadimplência no condomínio: como reduzir em até 80% com cobranças automatizadas',
    description: 'Descubra como a automação de cobranças transforma a gestão financeira e elimina o constrangimento das cobranças manuais.',
    hasImage: false,
    gradient: null,
  },
  {
    id: 2,
    tag: 'Tecnologia',
    title: 'Como a inteligência artificial está revolucionando a manutenção preditiva em condomínios',
    description: null,
    hasImage: true,
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #7c3aed 100%)',
    emoji: '👩‍💻',
  },
  {
    id: 3,
    tag: 'Gestão',
    title: 'Assembleia digital: como modernizar votações e aumentar a participação dos moradores',
    description: null,
    hasImage: true,
    gradient: 'linear-gradient(135deg, #0b071e 0%, #1e1b4b 50%, #5b21b6 100%)',
    emoji: '📊',
  },
];

export default function BlogSection() {
  return (
    <section style={{
      width: '100%',
      padding: '100px 60px',
      background: 'linear-gradient(160deg, #faf5ff 0%, #ede9fe 40%, #f5f3ff 100%)',
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#7c3aed',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px'
          }}>
            Insights e Tendências para Síndicos
          </span>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '400',
            color: '#1e1b4b',
            lineHeight: '1.2',
            maxWidth: '700px',
            margin: '0 auto 20px'
          }}>
            Acompanhe as novidades em{' '}
            <span style={{ color: '#7c3aed' }}>Gestão Condominial</span>
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
            Dicas, estratégias e tendências para síndicos modernos que querem transformar seus condomínios.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto',
          gap: '24px',
          alignItems: 'start',
        }}>

          {/* Card 1 — só texto, alinhado ao centro verticalmente */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px 36px',
            boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(167, 139, 250, 0.15)',
            alignSelf: 'center',
            transition: 'transform 0.2s',
            cursor: 'pointer',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span style={{
              display: 'inline-block',
              background: '#ede9fe',
              color: '#7c3aed',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '4px 12px',
              borderRadius: '99px',
              marginBottom: '20px'
            }}>Financeiro</span>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e1b4b',
              lineHeight: '1.4',
              marginBottom: '16px'
            }}>
              Inadimplência no condomínio: como reduzir em até 80% com cobranças automatizadas
            </h3>

            <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.7', marginBottom: '28px' }}>
              Descubra como a automação de cobranças transforma a gestão financeira e elimina o constrangimento das cobranças manuais.
            </p>

            <a href="#" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#7c3aed',
              fontWeight: '600',
              fontSize: '14px',
              textDecoration: 'none',
            }}>
              Leia mais <span style={{ fontSize: '16px' }}>↗</span>
            </a>
          </div>

          {/* Card 2 — imagem em cima, texto embaixo */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(124, 58, 237, 0.15)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Imagem simulada */}
            <div style={{
              height: '220px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Círculos decorativos */}
              <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(167,139,250,0.3)', top: '20px', left: '40px' }} />
              <div style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(167,139,250,0.2)', bottom: '10px', right: '30px' }} />
              <div style={{ position: 'absolute', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', top: '40px', right: '60px' }} />
              <span style={{ fontSize: '64px', position: 'relative', zIndex: 1 }}>🤖</span>
            </div>

            <div style={{ background: '#ffffff', padding: '28px 28px 32px', border: '1px solid rgba(167, 139, 250, 0.1)', borderTop: 'none' }}>
              <span style={{
                display: 'inline-block',
                background: '#ede9fe',
                color: '#7c3aed',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '99px',
                marginBottom: '14px'
              }}>Tecnologia</span>

              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1e1b4b', lineHeight: '1.4', marginBottom: '20px' }}>
                Como a inteligência artificial está revolucionando a manutenção preditiva em condomínios
              </h3>

              <a href="#" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#7c3aed',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
              }}>
                Leia mais <span style={{ fontSize: '16px' }}>↗</span>
              </a>
            </div>
          </div>

          {/* Card 3 — imagem em cima, texto embaixo */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(124, 58, 237, 0.15)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              height: '220px',
              background: 'linear-gradient(135deg, #0b071e 0%, #1e1b4b 50%, #5b21b6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(167,139,250,0.2)', bottom: '-60px', left: '-40px' }} />
              <div style={{ position: 'absolute', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(167,139,250,0.1)', top: '20px', right: '40px' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(167,139,250,0.03) 20px, rgba(167,139,250,0.03) 40px)' }} />
              <span style={{ fontSize: '64px', position: 'relative', zIndex: 1 }}>🗳️</span>
            </div>

            <div style={{ background: '#ffffff', padding: '28px 28px 32px', border: '1px solid rgba(167, 139, 250, 0.1)', borderTop: 'none' }}>
              <span style={{
                display: 'inline-block',
                background: '#ede9fe',
                color: '#7c3aed',
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 12px',
                borderRadius: '99px',
                marginBottom: '14px'
              }}>Gestão</span>

              <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1e1b4b', lineHeight: '1.4', marginBottom: '20px' }}>
                Assembleia digital: como modernizar votações e aumentar a participação dos moradores
              </h3>

              <a href="#" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#7c3aed',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
              }}>
                Leia mais <span style={{ fontSize: '16px' }}>↗</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}