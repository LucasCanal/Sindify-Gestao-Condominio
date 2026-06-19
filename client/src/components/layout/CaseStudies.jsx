import React from 'react';
import { ArrowUpRight, Shield, DollarSign, Leaf } from 'lucide-react';

export default function CaseStudies() {
  const cases = [
    {
      title: 'Transformação na Portaria',
      tag: 'SEGURANÇA INTEGADA',
      icon: <Shield size={24} color="#ffffff" />,
      bgImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80',
      overlayColor: 'rgba(76, 29, 149, 0.85)', // Violeta Sindify
      frontDesc: 'Como modernizamos o controle de acesso de 3 condomínios residenciais.',
      backText: 'Implementamos portaria remota integrada e reconhecimento facial. O resultado foi uma redução de 98% em falhas de identificação e aumento na percepção de segurança dos moradores no primeiro mês.',
      stats: 'Falhas de Acesso: -98%',
      btnText: 'Ver case de segurança'
    },
    {
      title: 'Sustentabilidade & Economia',
      tag: 'REDUÇÃO DE CUSTOS',
      icon: <Leaf size={24} color="#ffffff" />,
      bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
      overlayColor: 'rgba(11, 7, 30, 0.9)', // Escuro institucional
      frontDesc: 'Inteligência de dados aplicada à redução de consumo de recursos.',
      backText: 'Cruzamos dados de sensores de manutenção preventiva com algoritmos de consumo. Identificamos vazamentos ocultos e otimizamos a iluminação de áreas comuns, gerando economia real na taxa condominial.',
      stats: 'Consumo Geral: -22%',
      btnText: 'Explorar transformação'
    },
    {
      title: 'Zerar Inadimplência',
      tag: 'GESTÃO FINANCEIRA',
      icon: <DollarSign size={24} color="#ffffff" />,
      bgImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      overlayColor: 'rgba(249, 115, 22, 0.85)', // Laranja de Destaque
      frontDesc: 'Transparência e esteira de cobrança amigável automatizada.',
      backText: 'Substituímos processos manuais por uma esteira digital de avisos e negociação direta via app. O índice de adimplência subiu de forma histórica, garantindo caixa para obras essenciais.',
      stats: 'Arrecadação: +35%',
      btnText: 'Ver case completo'
    }
  ];

  return (
    <section style={{
      width: '100%',
      padding: '100px 80px',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* Cabeçalho da Seção */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '400',
          color: '#0b071e',
          marginBottom: '16px',
          letterSpacing: '-1px',
          fontFamily: '"Poppins", sans-serif'
        }}>
          Resultados da nossa <span style={{ color: '#7c3aed' }}>Consultoria Digital</span>
        </h2>
        <p style={{
          fontSize: '17px',
          color: '#6b7280',
          fontWeight: '400'
        }}>
          Conheça nosso impacto real na gestão e na vida dos moradores
        </p>
      </div>

      {/* Grid de Cards com Perspectiva 3D */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {cases.map((item, index) => (
          <div
            key={index}
            style={{
              perspective: '1000px', // Ativa o espaço 3D para o efeito flip funcionar
              height: '420px',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              const inner = e.currentTarget.querySelector('.card-inner');
              if (inner) inner.style.transform = 'rotateY(180deg)';
            }}
            onMouseLeave={e => {
              const inner = e.currentTarget.querySelector('.card-inner');
              if (inner) inner.style.transform = 'rotateY(0deg)';
            }}
          >
            {/* Container interno que executa a rotação */}
            <div 
              className="card-inner"
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
              }}
            >
              
              {/* ──────────────── FRENTE DO CARD ──────────────── */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden', // Esconde a face oposta durante o giro
                borderRadius: '24px',
                overflow: 'hidden',
                background: `linear-gradient(${item.overlayColor}, ${item.overlayColor}), url(${item.bgImage}) center/cover no-repeat`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '32px',
                zIndex: 2
              }}>
                {/* Topo da Frente */}
                <div>
                  <span style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase'
                  }}>
                    {item.tag}
                  </span>
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginTop: '12px',
                    lineHeight: '1.2'
                  }}>
                    {item.title}
                  </h3>
                </div>

                {/* Base da Frente */}
                <div>
                  <p style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    marginBottom: '24px',
                    maxWidth: '90%'
                  }}>
                    {item.frontDesc}
                  </p>
                  
                  {/* Botão padrão simulado da imagem original */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    color: '#111827',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {item.btnText}
                    <ArrowUpRight size={16} style={{ color: '#f97316' }} />
                  </div>
                </div>
              </div>

              {/* ──────────────── VERSO DO CARD (Revelado no Hover) ──────────────── */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)', // Já começa invertido para aparecer na rotação
                borderRadius: '24px',
                backgroundColor: '#0b071e', // Fundo escuro premium unificado
                border: '2px solid #4c1d95',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '32px',
                zIndex: 1
              }}>
                {/* Topo do Verso */}
                <div>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '20px'
                  }}>
                    {item.icon}
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
                    O Impacto Prático
                  </h4>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
                    {item.backText}
                  </p>
                </div>

                {/* Métrica Estatística de Destaque na Base */}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: '#a78bfa', fontWeight: '700', fontSize: '16px' }}>
                    {item.stats}
                  </span>
                  <span style={{ color: '#f97316', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                    Sindify Core →
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}