import {
  Car,
  Bike,
  ParkingCircle,
  ShieldCheck,
  Plus,
} from 'lucide-react'

const SectionCard = ({ title, icon: Icon, children }) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #ece9f5',
      borderRadius: '16px',
      padding: '24px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
      }}
    >
      <Icon size={20} color="#7c3aed" />
      <h3
        style={{
          margin: 0,
          color: '#1e1b4b',
        }}
      >
        {title}
      </h3>
    </div>

    {children}
  </div>
)

export default function Vehicles() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            margin: 0,
            color: '#1e1b4b',
            fontSize: '30px',
          }}
        >
          Veículos
        </h1>

        <p
          style={{
            marginTop: '6px',
            color: '#6b7280',
          }}
        >
          Gerencie os veículos vinculados à sua unidade.
        </p>
      </div>

      {/* Resumo */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #ece9f5',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <MiniStat value="2" label="Veículos" />
        <MiniStat value="1" label="Vaga Coberta" />
        <MiniStat value="0" label="Pendências" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: '20px',
        }}
      >
        <SectionCard
          title="Veículos Cadastrados"
          icon={Car}
        >
          <VehicleCard
            icon={<Car size={18} />}
            model="Honda Civic"
            plate="ABC-1234"
            color="Preto"
            spot="12"
          />

          <VehicleCard
            icon={<Bike size={18} />}
            model="Yamaha MT-07"
            plate="XYZ-9876"
            color="Azul"
            spot="12A"
          />

          <button style={buttonStyle}>
            <Plus size={16} />
            Adicionar Veículo
          </button>
        </SectionCard>

        <SectionCard
          title="Vagas de Garagem"
          icon={ParkingCircle}
        >
          <Info label="Vaga Principal" value="12" />
          <Info label="Tipo" value="Coberta" />
          <Info label="Bloco" value="A" />
        </SectionCard>

        <SectionCard
          title="Visitantes Autorizados"
          icon={ShieldCheck}
        >
          <VehicleVisitor
            name="Carlos Oliveira"
            vehicle="Gol Branco"
            plate="DEF-4567"
          />
        </SectionCard>
      </div>
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div>
      <h3 style={{ margin: 0, color: '#7c3aed' }}>
        {value}
      </h3>

      <p style={{ margin: 0, color: '#6b7280' }}>
        {label}
      </p>
    </div>
  )
}

function VehicleCard({
  icon,
  model,
  plate,
  color,
  spot,
}) {
  return (
    <div
      style={{
        border: '1px solid #ece9f5',
        borderRadius: '12px',
        padding: '14px',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {icon}
        <strong>{model}</strong>
      </div>

      <p style={{ color: '#6b7280' }}>
        {plate}
      </p>

      <p style={{ color: '#6b7280' }}>
        Cor: {color}
      </p>

      <p style={{ color: '#6b7280' }}>
        Vaga: {spot}
      </p>
    </div>
  )
}

function VehicleVisitor({
  name,
  vehicle,
  plate,
}) {
  return (
    <div
      style={{
        border: '1px solid #ece9f5',
        borderRadius: '12px',
        padding: '14px',
      }}
    >
      <strong>{name}</strong>

      <p style={{ color: '#6b7280' }}>
        {vehicle}
      </p>

      <p style={{ color: '#6b7280' }}>
        {plate}
      </p>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <p
        style={{
          margin: 0,
          fontSize: '12px',
          color: '#9ca3af',
        }}
      >
        {label}
      </p>

      <strong>{value}</strong>
    </div>
  )
}

const buttonStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  background: '#7c3aed',
  color: '#fff',
  cursor: 'pointer',
}