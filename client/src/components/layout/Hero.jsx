import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hero() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);

  const slides = [
    {
      type: 'left',
      tag: 'Sindify Gestão Condominial',
      title: <>Eficiência que <br /> <span style={{ color: '#7c3aedfa' }}>transforma a vida</span> <br /> em condomínio.</>,
      desc: 'Transparência. Organização. Facilidade. Uma plataforma completa para síndicos e moradores gerenciarem tudo em tempo real.',
      bg: 'linear-gradient(135deg, #050314 0%, #3b1a75 60%, #7c3aedee 100%)',
      hasOriginalArt: true
    },
    {
      type: 'left',
      tag: 'TECNOLOGIA INTEGRADA',
      title: <>Seu condomínio <br /> <span style={{ color: '#7c3aedfa' }}>pronto para o futuro</span> <br /> em até 10 dias.</>,
      desc: 'Com especialistas em suporte, segurança e implantação, alocados sob medida para as necessidades do seu espaço.',
      bg: 'linear-gradient(rgba(11, 7, 30, 0.85), rgba(22, 10, 38, 0.85))',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
    },
    {
      type: 'center',
      tag: 'DASHBOARDS INTELIGENTES',
      title: <>Dashboards sob medida <br /> para <span style={{ color: '#7c3aedfa' }}>decisões mais rápidas</span></>,
      desc: 'Visualize indicadores críticos do seu condomínio em tempo real, com dados claros para uma gestão mais assertiva.',
      bg: 'linear-gradient(135deg, #0b071e 0%, #1e1b4b 100%)',
      hasDashboardArt: true,
      hasButton: true,
      buttonText: 'Fale com um especialista'
    }
  ];

  const goTo = (index) => {
    if (index === currentSlide) return;
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setCurrentSlide(index);
  };

  const nextSlide = () => goTo(currentSlide + 1);
  const prevSlide = () => goTo(currentSlide - 1);

  // Auto-play
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      goTo(currentSlide + 1);
    }, 6000);
    return () => clearTimeout(timeoutRef.current);
  }, [currentSlide]);

  return (
    <section style={{
      width: '100%', padding: '40px 80px', backgroundColor: '#ffffff',
      position: 'relative', borderTop: '1px solid #f1f5f9'
    }}>

      {/* Seta Esquerda */}
      <button onClick={prevSlide} style={arrowStyle('left')}>
        <ChevronLeft size={40} strokeWidth={1.5} />
      </button>

      {/* Viewport do carrossel */}
      <div style={{
        width: '100%', height: '520px', borderRadius: '24px',
        position: 'relative', overflow: 'hidden'
      }}>

        {/* Track que desliza */}
        <div style={{
          display: 'flex',
          width: `${slides.length * 100}%`,
          height: '100%',
          transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
          transition: 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)'
        }}>
          {slides.map((slide, i) => (
            <div key={i} style={{
              width: `${100 / slides.length}%`,
              height: '100%',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
              padding: '0 80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: slide.type === 'center' ? 'center' : 'flex-start',
              background: slide.imageUrl
                ? `${slide.bg}, url(${slide.imageUrl}) center/cover no-repeat`
                : slide.bg,
            }}>

              {/* Arte abstrata do primeiro slide */}
              {slide.hasOriginalArt && (
                <>
                  <div style={{
                    position: 'absolute', top: '-20%', right: '-5%', width: '65%', height: '140%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
                    transform: 'rotate(-15deg)', pointerEvents: 'none'
                  }} />
                  <div style={{
                    position: 'absolute', top: '10%', right: '15%', width: '40%', height: '80%',
                    borderRight: '2px solid rgba(167, 139, 250, 0.3)', borderRadius: '50%',
                    filter: 'blur(4px)', transform: 'rotate(-25deg)', pointerEvents: 'none'
                  }} />
                </>
              )}

              {/* Arte do slide de dashboard (linha neon estilo Mosten) */}
              {slide.hasDashboardArt && (
                <>
                  <div style={{
                    position: 'absolute', top: '-30%', left: '-10%', width: '70%', height: '160%',
                    background: 'radial-gradient(circle, rgba(167, 139, 250, 0.2) 0%, transparent 65%)',
                    pointerEvents: 'none'
                  }} />
                  <svg
                    style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '55%', pointerEvents: 'none' }}
                    viewBox="0 0 400 520" preserveAspectRatio="none"
                  >
                    <path
                      d="M 420 -20 Q 250 180 320 280 T 100 540"
                      stroke="#a78bfa" strokeWidth="2" fill="none" opacity="0.6"
                    />
                    <path
                      d="M 420 -20 Q 250 180 320 280 T 100 540"
                      stroke="#c4b5fd" strokeWidth="6" fill="none" opacity="0.15"
                      filter="blur(6px)"
                    />
                  </svg>
                </>
              )}

              {/* Conteúdo de texto */}
              <div style={{
                maxWidth: '850px', zIndex: 2, display: 'flex', flexDirection: 'column',
                alignItems: slide.type === 'center' ? 'center' : 'flex-start',
                textAlign: slide.type === 'center' ? 'center' : 'left'
              }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  {slide.type === 'left' && <div style={{ width: '12px', height: '2px', backgroundColor: '#a78bfa' }} />}
                  <span style={{ color: '#a78bfa', fontSize: '13px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    {slide.tag}
                  </span>
                  {slide.type === 'center' && <div style={{ width: '12px', height: '2px', backgroundColor: '#a78bfa' }} />}
                </div>

                <h1 style={{
                  fontSize: '56px', fontWeight: '700', color: '#ffffff',
                  marginBottom: '24px', lineHeight: '1.15', letterSpacing: '-1.5px'
                }}>
                  {slide.title}
                </h1>

                <p style={{
                  fontSize: '18px', color: '#9ca3af', lineHeight: '1.6',
                  fontWeight: '400', maxWidth: '600px', marginBottom: slide.hasButton ? '32px' : '0'
                }}>
                  {slide.desc}
                </p>

                {slide.hasButton && (
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      background: '#f97316', border: 'none', color: '#fff', padding: '14px 32px',
                      borderRadius: '12px', fontWeight: '600', cursor: 'pointer', transition: '0.2s',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)'
                    }}
                    onMouseEnter={e => e.target.style.background = '#ea580c'}
                    onMouseLeave={e => e.target.style.background = '#f97316'}
                  >
                    {slide.buttonText}
                  </button>
                )}
              </div>

              {/* Mockup de dashboard no slide 3 */}
              {slide.hasDashboardArt && (
                <div style={{
                  position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', gap: '12px', zIndex: 2
                }}>
                  <div style={{
                    width: '64px', borderRadius: '14px', background: '#1e1b4b',
                    border: '1px solid rgba(167,139,250,0.25)', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '20px 0'
                  }}>
                    {['◆', '▢', '◎', '●'].map((s, idx) => (
                      <span key={idx} style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: idx === 1 ? '#a78bfa' : 'rgba(167,139,250,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: idx === 1 ? '#1e1b4b' : '#a78bfa', fontSize: '12px'
                      }}>{s}</span>
                    ))}
                  </div>
                  <div style={{
                    width: '260px', borderRadius: '14px', background: '#13102b',
                    border: '1px solid rgba(167,139,250,0.25)', padding: '18px',
                    display: 'none'
                  }} className="dashboard-card-desktop">
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seta Direita */}
      <button onClick={nextSlide} style={arrowStyle('right')}>
        <ChevronRight size={40} strokeWidth={1.5} />
      </button>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={dotStyle(currentSlide === i)} />
        ))}
      </div>
    </section>
  );
}

const arrowStyle = (side) => ({
  position: 'absolute', [side]: '30px', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', zIndex: 10,
  transition: 'transform 0.2s'
});

const dotStyle = (isActive) => ({
  width: '12px', height: '12px', borderRadius: '50%', border: 'none', padding: 0,
  backgroundColor: isActive ? '#4c1d95' : '#d1d5db', cursor: 'pointer', transition: '0.3s'
});