import { useEffect, useState } from 'react'
import {
  Calendar,
  Plus,
  Trash2,
  Waves,
  Flame,
  PartyPopper,
  UtensilsCrossed,
  Trophy,
  Building2,
  Check,
  Clock,
  Users,
  X,
  Clapperboard,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const pickIcon = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('festa') || n.includes('salão') || n.includes('salao')) return PartyPopper
  if (n.includes('churras')) return Flame
  if (n.includes('gourmet') || n.includes('cozinha')) return UtensilsCrossed
  if (n.includes('quadra') || n.includes('society') || n.includes('esporte')) return Trophy
  if (n.includes('sauna')) return Flame
  if (n.includes('piscina')) return Waves
  if (n.includes('cinema') || n.includes('cine')) return Clapperboard
  return Building2
}

const STATUS_COLORS = {
  confirmada: { bg: '#dcfce7', color: '#166534' },
  pendente: { bg: '#fef3c7', color: '#92400e' },
  cancelada: { bg: '#fee2e2', color: '#dc2626' },
  concluida: { bg: '#dbeafe', color: '#2563eb' },
}

export default function Bookings() {
  const { user } = useAuthStore()
  const isSindico = user?.role === 'sindico'

  const [spaces, setSpaces] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedSpace, setSelectedSpace] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [guests, setGuests] = useState('')

  const [spaceModal, setSpaceModal] = useState(false)
  const [spaceName, setSpaceName] = useState('')
  const [spaceCapacity, setSpaceCapacity] = useState('')

  const fetchData = async () => {
    try {
      const [spacesRes, bookingsRes] = await Promise.all([
        api.get('/bookings/spaces'),
        api.get('/bookings/me'),
      ])
      setSpaces(spacesRes?.data?.data?.spaces || [])
      setBookings(bookingsRes?.data?.data?.bookings || [])
    } catch (error) {
      console.error('Erro ao buscar reservas', error)
      toast.error(error.response?.data?.message || 'Erro ao buscar reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const createReservation = async () => {
    if (!selectedSpace) {
      toast.error('Selecione uma área para reservar.')
      return
    }
    if (!date || !startTime || !endTime) {
      toast.error('Preencha data, início e fim.')
      return
    }
    try {
      await api.post('/bookings', {
        spaceId: selectedSpace,
        date,
        startTime,
        endTime,
        guests: guests ? Number(guests) : 0,
      })
      toast.success('Reserva criada com sucesso')
      setSelectedSpace('')
      setDate('')
      setStartTime('')
      setEndTime('')
      setGuests('')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar reserva')
    }
  }

  const cancelReservation = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`)
      toast.success('Reserva cancelada')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cancelar reserva')
    }
  }

  const createSpace = async (e) => {
    e.preventDefault()
    try {
      await api.post('/bookings/spaces', {
        name: spaceName,
        capacity: spaceCapacity ? Number(spaceCapacity) : undefined,
      })
      toast.success('Área criada com sucesso')
      setSpaceName('')
      setSpaceCapacity('')
      setSpaceModal(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar área')
    }
  }

  const selectedSpaceObj = spaces.find((s) => s._id === selectedSpace)

  if (loading) return <p style={{ color: '#6b7280' }}>Carregando reservas...</p>

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '30px', color: '#1e1b4b' }}>Reservas</h1>
          <p style={{ marginTop: '6px', color: '#6b7280' }}>Reserve áreas comuns do condomínio.</p>
        </div>
        {isSindico && (
          <button onClick={() => setSpaceModal(true)} style={{ ...buttonStyle, marginTop: 0 }}>
            <Plus size={16} /> Nova Área
          </button>
        )}
      </div>

      {/* Áreas */}
      <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: '16px', color: '#1e1b4b' }}>Escolha a área</h2>
        {selectedSpaceObj && (
          <span style={{ fontSize: '13px', color: '#7c3aed', fontWeight: '600' }}>
            {selectedSpaceObj.name} selecionada
          </span>
        )}
      </div>

      {spaces.length === 0 ? (
        <p style={{ color: '#9ca3af', marginBottom: '28px' }}>
          Nenhuma área cadastrada.{isSindico ? ' Crie a primeira clicando em "Nova Área".' : ''}
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {spaces.map((space) => {
            const Icon = pickIcon(space.name)
            const active = selectedSpace === space._id
            return (
              <button
                key={space._id}
                type="button"
                onClick={() => setSelectedSpace(space._id)}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  background: active ? '#f5f3ff' : '#ffffff',
                  border: active ? '2px solid #7c3aed' : '1px solid #ece9f5',
                  boxShadow: active ? '0 4px 14px rgba(124,58,237,0.15)' : 'none',
                  borderRadius: '16px',
                  padding: '22px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  fontFamily: 'inherit',
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#7c3aed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={13} color="#fff" strokeWidth={3} />
                  </span>
                )}
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: active ? '#ede9fe' : '#f5f3ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={24} color="#7c3aed" />
                </div>
                <h3 style={{ margin: '0 0 6px', color: '#1e1b4b', fontSize: '16px' }}>{space.name}</h3>
                {space.capacity ? (
                  <p style={{ margin: '0 0 6px', color: '#6b7280', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Users size={13} /> Até {space.capacity} pessoas
                  </p>
                ) : null}
                <span style={{ color: '#16a34a', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                  <Clock size={13} />
                  {space.openTime} – {space.closeTime}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Formulário */}
      <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0, color: '#1e1b4b' }}>Nova Reserva</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
          <div>
            <label style={{ color: '#6b7280', fontWeight: '300' }} >Data</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#6b7280', fontWeight: '300' }} >Início</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#6b7280', fontWeight: '300' }} >Fim</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: '#6b7280', fontWeight: '300' }} >Convidados</label>
            <input type="number" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="0" style={inputStyle} />
          </div>
        </div>

        <button onClick={createReservation} style={buttonStyle}>
          <Plus size={18} />
          Confirmar Reserva
        </button>
      </div>

      {/* Minhas Reservas */}
      <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '24px' }}>
        <h2 style={{ marginTop: 0, color: '#1e1b4b' }}>Minhas Reservas</h2>

        {bookings.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Nenhuma reserva cadastrada.</p>
        ) : (
          bookings.map((reservation) => {
            const sc = STATUS_COLORS[reservation.status] || STATUS_COLORS.pendente
            return (
              <div
                key={reservation._id}
                style={{
                  border: '1px solid #ece9f5',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h4 style={{ margin: 0, color: '#1e1b4b' }}>{reservation.space?.name || 'Área'}</h4>
                  <p style={{ margin: '6px 0', color: '#6b7280', display: 'flex', alignItems: 'center' }}>
                    <Calendar size={14} style={{ marginRight: '6px' }} />
                    {new Date(reservation.date).toLocaleDateString('pt-BR')} • {reservation.startTime} - {reservation.endTime}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: sc.bg, color: sc.color, padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
                    {reservation.status}
                  </span>
                  {reservation.status !== 'cancelada' && (
                    <button
                      onClick={() => cancelReservation(reservation._id)}
                      style={{ border: 'none', background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {spaceModal && (
        <div style={overlayStyle}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1e1b4b' }}>Nova Área</h2>
              <button onClick={() => setSpaceModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            <form onSubmit={createSpace} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label>Nome da Área</label>
                <input value={spaceName} onChange={(e) => setSpaceName(e.target.value)} required placeholder="Salão de Festas" style={inputStyle} />
              </div>
              <div>
                <label>Capacidade</label>
                <input type="number" value={spaceCapacity} onChange={(e) => setSpaceCapacity(e.target.value)} placeholder="50" style={inputStyle} />
              </div>
              <button type="submit" style={buttonStyle}>Criar Área</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  marginTop: '6px',
  boxSizing: 'border-box',
  color: '#6b7280',
  fontWeight: '300',
}

const buttonStyle = {
  marginTop: '20px',
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}