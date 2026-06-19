import { useEffect, useState } from 'react'
import {
  Users,
  Car,
  Package,
  Calendar,
} from 'lucide-react'
import api from '../services/api'
import useAuthStore from '../store/authStore'

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
    <div>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{label}</p>
      <h3 style={{ margin: '4px 0 0', color: '#1e1b4b', fontSize: '24px' }}>{value}</h3>
    </div>
  </div>
)

const SectionCard = ({ title, children }) => (
  <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '24px' }}>
    <h3 style={{ marginTop: 0, marginBottom: '18px', color: '#1e1b4b', fontSize: '18px' }}>{title}</h3>
    {children}
  </div>
)

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

export default function Dashboard() {
  const { user } = useAuthStore()
  const [unit, setUnit] = useState(null)
  const [vehicles, setVehicles] = useState([])
  const [packages, setPackages] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled([
        api.get('/apartments/my-unit'),
        api.get('/vehicles/me'),
        api.get('/packages/me'),
        api.get('/bookings/me'),
      ])
      if (results[0].status === 'fulfilled') setUnit(results[0].value.data?.data?.apartment || null)
      if (results[1].status === 'fulfilled') setVehicles(results[1].value.data?.data?.vehicles || [])
      if (results[2].status === 'fulfilled') setPackages(results[2].value.data?.data?.packages || [])
      if (results[3].status === 'fulfilled') setBookings(results[3].value.data?.data?.bookings || [])
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading) return <p style={{ color: '#6b7280' }}>Carregando...</p>

  const residents = unit?.residentsInfo || []
  const pendingPackages = packages.filter((p) => p.status === 'aguardando')
  const upcomingBookings = bookings
    .filter((b) => b.status !== 'cancelada' && new Date(b.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  const nextBooking = upcomingBookings[0]
  const responsavel = residents[0]?.name || user?.name || 'Não informado'

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '30px', color: '#1e1b4b' }}>Minha Área</h1>
        <p style={{ marginTop: '6px', color: '#6b7280' }}>
          Olá{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Aqui está o resumo da sua unidade.
        </p>
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard icon={Users} label="Moradores" value={residents.length} color="#7c3aed" />
        <StatCard icon={Car} label="Veículos" value={vehicles.length} color="#2563eb" />
        <StatCard icon={Package} label="Encomendas" value={pendingPackages.length} color="#f59e0b" />
        <StatCard icon={Calendar} label="Reservas" value={upcomingBookings.length} color="#16a34a" />
      </div>

      {/* Conteúdo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '20px' }}>
        <SectionCard title="Dados da Unidade">
          {unit ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <Info label="Apartamento" value={unit.number || '—'} />
              <Info label="Bloco" value={unit.block || '—'} />
              <Info label="Andar" value={unit.floor != null ? `${unit.floor}º` : '—'} />
              <Info label="Área" value={unit.area ? `${unit.area}m²` : '—'} />
              <Info label="Tipo" value={unit.type || 'Residencial'} />
            </div>
          ) : (
            <p style={{ color: '#9ca3af', margin: 0 }}>Você ainda não possui uma unidade vinculada.</p>
          )}
        </SectionCard>

        <SectionCard title="Morador Responsável">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
              {initials(responsavel)}
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#1e1b4b' }}>{responsavel}</h4>
              <p style={{ margin: 0, color: '#6b7280' }}>{residents[0]?.role || 'Morador Principal'}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Veículos Vinculados">
          {vehicles.length === 0 ? (
            <p style={{ color: '#9ca3af', margin: 0 }}>Nenhum veículo vinculado.</p>
          ) : (
            vehicles.map((v) => (
              <VehicleCard key={v._id} model={[v.brand, v.model].filter(Boolean).join(' ') || 'Veículo'} plate={v.plate} />
            ))
          )}
        </SectionCard>

        <SectionCard title="Encomendas">
          {pendingPackages.length === 0 ? (
            <div style={{ background: '#ecfdf5', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ margin: 0, color: '#166534' }}>Nenhuma encomenda pendente</h4>
              <p style={{ marginBottom: 0, color: '#166534' }}>Você está em dia com suas retiradas.</p>
            </div>
          ) : (
            pendingPackages.map((p) => (
              <div key={p._id} style={{ border: '1px solid #ece9f5', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
                <strong style={{ display: 'block', color: '#1e1b4b' }}>{p.sender || 'Encomenda'}</strong>
                <span style={{ color: '#6b7280' }}>Aguardando retirada</span>
              </div>
            ))
          )}
        </SectionCard>

        <SectionCard title="Próxima Reserva">
          {nextBooking ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={22} color="#7c3aed" />
              <div>
                <h4 style={{ margin: 0, color: '#1e1b4b' }}>{nextBooking.space?.name || 'Área comum'}</h4>
                <p style={{ margin: 0, color: '#6b7280' }}>
                  {new Date(nextBooking.date).toLocaleDateString('pt-BR')} às {nextBooking.startTime}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: '#9ca3af', margin: 0 }}>Nenhuma reserva agendada.</p>
          )}
        </SectionCard>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{label}</p>
      <strong style={{ color: '#1e1b4b', fontSize: '15px' }}>{value ?? '—'}</strong>
    </div>
  )
}

function VehicleCard({ model, plate }) {
  return (
    <div style={{ border: '1px solid #ece9f5', borderRadius: '12px', padding: '12px', marginBottom: '10px' }}>
      <strong style={{ display: 'block', color: '#1e1b4b' }}>{model}</strong>
      <span style={{ color: '#6b7280' }}>{plate}</span>
    </div>
  )
}
