import {
  Bell,
  AlertTriangle,
  Eye,
  Megaphone,
  } from 'lucide-react'
  
  export default function Notices() {
  const notices = [
  {
  id: 1,
  title: 'Interrupção de Água',
  date: '20/06/2026',
  category: 'Urgente',
  content:
  'O abastecimento será interrompido das 09h às 14h para manutenção na rede hidráulica.',
  },
  {
  id: 2,
  title: 'Festa Junina do Condomínio',
  date: '18/06/2026',
  category: 'Evento',
  content:
  'Participe da nossa festa no salão de eventos. Traga sua família!',
  },
  {
  id: 3,
  title: 'Manutenção do Elevador',
  date: '15/06/2026',
  category: 'Manutenção',
  content:
  'O elevador social ficará indisponível das 08h às 12h.',
  },
  ]
  
  return ( <div>
  {/* Cabeçalho */}
  <div style={{ marginBottom: '28px' }}>
  <h1
  style={{
  margin: 0,
  fontSize: '30px',
  color: '#1e1b4b',
  }}
  >
  Avisos </h1>
  
      <p
        style={{
          marginTop: '6px',
          color: '#6b7280',
        }}
      >
        Comunicados e informações importantes do condomínio.
      </p>
    </div>
  
    {/* Cards */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      <StatCard
        icon={Bell}
        value="12"
        label="Avisos Totais"
      />
  
      <StatCard
        icon={Eye}
        value="3"
        label="Não Lidos"
      />
  
      <StatCard
        icon={AlertTriangle}
        value="1"
        label="Urgente"
      />
    </div>
  
    {/* Aviso Urgente */}
    <div
      style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <AlertTriangle
          size={22}
          color="#dc2626"
        />
  
        <span
          style={{
            color: '#dc2626',
            fontWeight: '700',
          }}
        >
          AVISO URGENTE
        </span>
      </div>
  
      <h2
        style={{
          margin: '0 0 10px',
          color: '#7f1d1d',
        }}
      >
        Interrupção de Água
      </h2>
  
      <p
        style={{
          margin: 0,
          color: '#991b1b',
        }}
      >
        O abastecimento será interrompido das
        09h às 14h para manutenção na rede.
      </p>
    </div>
  
    {/* Lista */}
    <div
      style={{
        display: 'grid',
        gap: '16px',
      }}
    >
      {notices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
        />
      ))}
    </div>
  </div>
  
  )
  }
  
  function StatCard({
  icon: Icon,
  value,
  label,
  }) {
  return (
  <div
  style={{
  background: '#ffffff',
  border: '1px solid #ece9f5',
  borderRadius: '16px',
  padding: '20px',
  }}
  > <Icon
       size={20}
       color="#7c3aed"
     />
  
    <h2
      style={{
        margin: '10px 0 4px',
        color: '#1e1b4b',
      }}
    >
      {value}
    </h2>
  
    <p
      style={{
        margin: 0,
        color: '#6b7280',
      }}
    >
      {label}
    </p>
  </div>
  
  )
  }
  
  function NoticeCard({ notice }) {
  const categoryColors = {
  Urgente: {
  bg: '#fee2e2',
  color: '#dc2626',
  },
  Manutenção: {
  bg: '#fef3c7',
  color: '#d97706',
  },
  Evento: {
  bg: '#dcfce7',
  color: '#16a34a',
  },
  Informativo: {
  bg: '#dbeafe',
  color: '#2563eb',
  },
  }
  
  const category =
  categoryColors[notice.category]
  
  return (
  <div
  style={{
  background: '#ffffff',
  border: '1px solid #ece9f5',
  borderRadius: '16px',
  padding: '22px',
  }}
  >
  <div
  style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
  flexWrap: 'wrap',
  gap: '10px',
  }}
  >
  <h3
  style={{
  margin: 0,
  color: '#1e1b4b',
  }}
  >
  {notice.title} </h3>
  
      <span
        style={{
          background: category.bg,
          color: category.color,
          padding: '6px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {notice.category}
      </span>
    </div>
  
    <p
      style={{
        color: '#6b7280',
        marginTop: 0,
      }}
    >
      {notice.date}
    </p>
  
    <p
      style={{
        marginBottom: 0,
        color: '#374151',
        lineHeight: '1.6',
      }}
    >
      {notice.content}
    </p>
  </div>
  
  )
  }
  