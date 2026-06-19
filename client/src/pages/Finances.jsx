import {
  Wallet,
  Receipt,
  Calendar,
  CheckCircle,
  Download,
  Copy,
  } from 'lucide-react'
  
  export default function Finances() {
  const payments = [
  {
  month: 'Junho 2026',
  date: '05/06/2026',
  value: 'R$ 580,00',
  },
  {
  month: 'Maio 2026',
  date: '04/05/2026',
  value: 'R$ 580,00',
  },
  {
  month: 'Abril 2026',
  date: '07/04/2026',
  value: 'R$ 580,00',
  },
  ]
  
  return ( <div>
  <div style={{ marginBottom: '28px' }}>
  <h1
  style={{
  margin: 0,
  fontSize: '30px',
  color: '#1e1b4b',
  }}
  >
  Finanças </h1>
  
      <p
        style={{
          marginTop: '6px',
          color: '#6b7280',
        }}
      >
        Acompanhe pagamentos e cobranças da sua unidade.
      </p>
    </div>
  
    {/* Cards */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'repeat(auto-fit,minmax(220px,1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}
    >
      <StatCard
        icon={CheckCircle}
        value="Em Dia"
        label="Situação"
      />
  
      <StatCard
        icon={Calendar}
        value="10/07"
        label="Próximo Vencimento"
      />
  
      <StatCard
        icon={Wallet}
        value="R$ 580"
        label="Próxima Cobrança"
      />
  
      <StatCard
        icon={Receipt}
        value="6"
        label="Pagamentos em 2026"
      />
    </div>
  
    {/* Boleto */}
    <div
      style={{
        background: '#fff',
        border: '1px solid #ece9f5',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: '#1e1b4b',
        }}
      >
        Próximo Boleto
      </h3>
  
      <p>
        Taxa Condominial - Julho
      </p>
  
      <p>
        Vencimento: 10/07/2026
      </p>
  
      <h2
        style={{
          color: '#7c3aed',
        }}
      >
        R$ 580,00
      </h2>
  
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <button style={primaryButton}>
          <Download size={16} />
          Baixar Boleto
        </button>
  
        <button style={secondaryButton}>
          <Copy size={16} />
          Copiar Pix
        </button>
      </div>
    </div>
  
    {/* Histórico */}
    <div
      style={{
        background: '#fff',
        border: '1px solid #ece9f5',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: '#1e1b4b',
        }}
      >
        Histórico de Pagamentos
      </h3>
  
      {payments.map((payment) => (
        <div
          key={payment.month}
          style={{
            padding: '14px 0',
            borderBottom:
              '1px solid #f3f4f6',
          }}
        >
          <strong>
            {payment.month}
          </strong>
  
          <p
            style={{
              margin: '4px 0',
              color: '#6b7280',
            }}
          >
            Pago em {payment.date}
          </p>
  
          <span
            style={{
              color: '#16a34a',
              fontWeight: '600',
            }}
          >
            {payment.value}
          </span>
        </div>
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
  background: '#fff',
  border: '1px solid #ece9f5',
  borderRadius: '16px',
  padding: '20px',
  }}
  > <Icon
       size={20}
       color="#7c3aed"
     />

    <h3
      style={{
        margin: '10px 0 4px',
        color: '#1e1b4b',
      }}
    >
      {value}
    </h3>
  
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
  
  const primaryButton = {
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  }
  
  const secondaryButton = {
  background: '#fff',
  color: '#7c3aed',
  border: '1px solid #d8b4fe',
  borderRadius: '10px',
  padding: '12px 16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  }
  