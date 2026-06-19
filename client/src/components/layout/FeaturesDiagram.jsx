import React from 'react';
import {
  ShieldCheck,
  DollarSign,
  FileText,
  Users,
  Wrench,
  Bell,
  Smartphone,
  Key
} from 'lucide-react';

export default function FeaturesDiagram() {
  // Coordenadas ajustadas para simetria perfeita e espaçamento na base
  const nodes = [
    // Lado Esquerdo
    { label: 'Portaria & Segurança 24h', icon: <ShieldCheck size={20} color="#4c1d95" />, top: '12%', left: '12%' },
    { label: 'Finanças & Inadimplência', icon: <DollarSign size={20} color="#4c1d95" />, top: '42%', left: '0%' },
    { label: 'Prestação de Contas', icon: <FileText size={20} color="#4c1d95" />, top: '70%', left: '6%' },
    { label: 'Assembleias Virtuais', icon: <Users size={20} color="#4c1d95" />, top: '90%', left: '22%' },

    // Lado Direito
    { label: 'Manutenção Preventiva', icon: <Wrench size={20} color="#4c1d95" />, top: '12%', right: '12%' },
    { label: 'Comunicação & Avisos', icon: <Bell size={20} color="#4c1d95" />, top: '42%', right: '0%' },
    { label: 'Aplicativo do Morador', icon: <Smartphone size={20} color="#4c1d95" />, top: '70%', right: '6%' },
    { label: 'Reserva de Espaços', icon: <Key size={20} color="#4c1d95" />, top: '90%', right: '22%' },
  ];

  return (
    <section style={{
      width: '100%',
      padding: '100px 0',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Linhas decorativas de fundo */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-5%',
        width: '110%',
        height: '500px',
        border: '1px solid rgba(167, 139, 250, 0.1)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Títulos principais */}
      <div style={{ textAlign: 'center', marginBottom: '60px', zIndex: 2, padding: '0 20px' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '400',
          color: '#0b071e',
          lineHeight: '1.2',
          letterSpacing: '-1px',
          marginBottom: '20px',
          fontFamily: '"Poppins", sans-serif'
        }}>
          Soluções digitais integradas <br />
          para <span style={{ color: '#7c3aed' }}>administração condominial</span>
        </h2>
        <p style={{
          fontSize: '17px',
          color: '#6b7280',
          maxWidth: '650px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Centralize toda a operação. Unimos tecnologia de ponta e processos transparentes para gerar eficiência de verdade.
        </p>
      </div>

      {/* Container do Diagrama */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        height: '680px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}>

        {/* Anéis orbitais centralizados */}
        <div style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          border: '1px solid rgba(167, 139, 250, 0.15)',
          borderRadius: '120px',
          transform: 'rotate(45deg)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute',
          width: '380px',
          height: '380px',
          border: '2px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '90px',
          transform: 'rotate(45deg)',
          pointerEvents: 'none'
        }} />

        {/* NÚCLEO CENTRAL CORRIGIDO (Sindify S.) */}
        <div style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          backgroundColor: '#ffffff',
          borderRadius: '40px',
          boxShadow: '0 25px 60px rgba(11, 7, 30, 0.08), 0 0 0 1px rgba(139, 92, 246, 0.08)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 3
        }}>
          <span style={{
            fontSize: '62px',
            fontWeight: '800',
            fontFamily: '"Poppins", "Inter", sans-serif',  // 🔥 Fonte definida explicitamente para curvas limpas
            lineHeight: '1.3',
            display: 'inline-flex',
            alignItems: 'baseline',
            padding: '6px 4px'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #0b071e 0%, #4c1d95 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              transform: 'skewX(-8deg)',   // 🔥 Itálico manual via skew, preserva as curvas do S
            }}>
              S
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #4c1d95 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}>
              .
            </span>
          </span>
        </div>

        {/* MAPEAMENTO DOS CARDS (Nodes) */}
        {nodes.map((node, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: node.top,
              left: node.left,
              right: node.right,
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: '#ffffff',
              padding: '12px 24px',
              borderRadius: '22px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
              border: '1px solid #f1f5f9',
              zIndex: 2,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = '#a78bfa';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#f1f5f9';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Ícone Container */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '13px',
              backgroundColor: '#f5f3ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {node.icon}
            </div>

            {/* Texto do Pilar */}
            <span style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#111827',
              fontFamily: '"Poppins", sans-serif'
            }}>
              {node.label}
            </span>
          </div>
        ))}

      </div>
    </section>
  );
}