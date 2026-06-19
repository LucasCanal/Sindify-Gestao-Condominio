import {
  Package,
  Clock,
  CheckCircle,
  Search,
} from 'lucide-react'

export default function Packages() {
  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            margin: 0,
            color: '#1e1b4b',
            fontSize: '30px',
          }}
        >
          Encomendas
        </h1>

        <p
          style={{
            marginTop: '6px',
            color: '#6b7280',
          }}
        >
          Acompanhe suas entregas e retiradas.
        </p>
      </div>

      {/* Resumo */}
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
          icon={Package}
          value="2"
          label="Aguardando"
        />

        <StatCard
          icon={Clock}
          value="1"
          label="Recebidas Hoje"
        />

        <StatCard
          icon={CheckCircle}
          value="15"
          label="No Mês"
        />
      </div>

      {/* Busca */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #ece9f5',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}
      >
        <Search size={18} color="#9ca3af" />

        <input
          placeholder="Buscar encomenda..."
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
          }}
        />
      </div>

      {/* Encomendas */}
      <div
        style={{
          display: 'grid',
          gap: '16px',
        }}
      >
        <PackageCard
          title="Mercado Livre"
          date="18/06/2026 às 14:22"
          status="Aguardando Retirada"
        />

        <PackageCard
          title="Amazon"
          date="17/06/2026 às 10:45"
          status="Aguardando Retirada"
        />

        <PackageCard
          title="Shopee"
          date="10/06/2026"
          status="Retirada"
        />
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
        borderRadius: '14px',
        padding: '20px',
      }}
    >
      <Icon size={20} color="#7c3aed" />

      <h2
        style={{
          marginBottom: '4px',
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

function PackageCard({
  title,
  date,
  status,
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #ece9f5',
        borderRadius: '14px',
        padding: '18px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: '#1e1b4b',
        }}
      >
        {title}
      </h3>

      <p style={{ color: '#6b7280' }}>
        Recebido em: {date}
      </p>

      <span
        style={{
          background:
            status === 'Retirada'
              ? '#dcfce7'
              : '#fef3c7',
          color:
            status === 'Retirada'
              ? '#166534'
              : '#92400e',
          padding: '6px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {status}
      </span>
    </div>
  )
}