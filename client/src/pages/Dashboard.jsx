import {
  Home,
  Users,
  Car,
  Wallet,
  Package,
  Calendar,
  } from 'lucide-react'
  
  const StatCard = ({ icon: Icon, label, value, color }) => (
  
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #ece9f5',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={22} color="#fff" />
      </div>
  
  ```
  <div>
    <p
      style={{
        margin: 0,
        color: '#6b7280',
        fontSize: '13px',
      }}
    >
      {label}
    </p>
  
    <h3
      style={{
        margin: '4px 0 0',
        color: '#1e1b4b',
        fontSize: '24px',
      }}
    >
      {value}
    </h3>
  </div>
  
    </div>
  )
  
  const SectionCard = ({ title, children }) => (
  
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #ece9f5',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: '18px',
          color: '#1e1b4b',
          fontSize: '18px',
        }}
      >
        {title}
      </h3>
  
  ```
  {children}
  ```
  
    </div>
  )
  
  export default function Apartments() {
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
  Minha Área </h1>
  
  ```
      <p
        style={{
          marginTop: '6px',
          color: '#6b7280',
        }}
      >
        Informações completas da sua unidade.
      </p>
    </div>
  
    {/* Resumo */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      <StatCard
        icon={Users}
        label="Moradores"
        value="3"
        color="#7c3aed"
      />
  
      <StatCard
        icon={Car}
        label="Veículos"
        value="2"
        color="#2563eb"
      />
  
      <StatCard
        icon={Package}
        label="Encomendas"
        value="1"
        color="#f59e0b"
      />
  
      <StatCard
        icon={Wallet}
        label="Pendências"
        value="0"
        color="#16a34a"
      />
    </div>
  
    {/* Conteúdo */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
        gap: '20px',
      }}
    >
      <SectionCard title="Dados da Unidade">
        <div style={{ display: 'grid', gap: '12px' }}>
          <Info label="Apartamento" value="101" />
          <Info label="Bloco" value="A" />
          <Info label="Andar" value="1º" />
          <Info label="Área" value="78m²" />
          <Info label="Tipo" value="Residencial" />
        </div>
      </SectionCard>
  
      <SectionCard title="Morador Responsável">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#7c3aed',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
            }}
          >
            LF
          </div>
  
          <div>
            <h4
              style={{
                margin: 0,
                color: '#1e1b4b',
              }}
            >
              Lucas Felix
            </h4>
  
            <p
              style={{
                margin: 0,
                color: '#6b7280',
              }}
            >
              Morador Principal
            </p>
          </div>
        </div>
      </SectionCard>
  
      <SectionCard title="Veículos Vinculados">
        <VehicleCard
          model="Honda Civic"
          plate="ABC-1234"
        />
  
        <VehicleCard
          model="Fiat Argo"
          plate="XYZ-9876"
        />
      </SectionCard>
  
      <SectionCard title="Situação Financeira">
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #bbf7d0',
            padding: '16px',
            borderRadius: '12px',
          }}
        >
          <h4
            style={{
              margin: 0,
              color: '#166534',
            }}
          >
            ✅ Tudo em dia
          </h4>
  
          <p
            style={{
              marginBottom: 0,
              color: '#166534',
            }}
          >
            Próximo vencimento: 10/07/2026
          </p>
        </div>
      </SectionCard>
  
      <SectionCard title="Próxima Reserva">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Calendar
            size={22}
            color="#7c3aed"
          />
  
          <div>
            <h4
              style={{
                margin: 0,
                color: '#1e1b4b',
              }}
            >
              Salão de Festas
            </h4>
  
            <p
              style={{
                margin: 0,
                color: '#6b7280',
              }}
            >
              25/06/2026 às 18:00
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  </div>
  
  )
  }
  
  function Info({ label, value }) {
  return ( <div>
  <p
  style={{
  margin: 0,
  fontSize: '12px',
  color: '#9ca3af',
  }}
  >
  {label} </p>
  
  ```
    <strong
      style={{
        color: '#1e1b4b',
      }}
    >
      {value}
    </strong>
  </div>
  
  )
  }
  
  function VehicleCard({ model, plate }) {
  return (
  <div
  style={{
  border: '1px solid #ece9f5',
  borderRadius: '12px',
  padding: '12px',
  marginBottom: '10px',
  }}
  >
  <strong
  style={{
  display: 'block',
  color: '#1e1b4b',
  }}
  >
  {model} </strong>
  
  ```
    <span
      style={{
        color: '#6b7280',
      }}
    >
      {plate}
    </span>
  </div>

  )
  }  