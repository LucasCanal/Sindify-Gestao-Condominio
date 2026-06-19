import { useState } from 'react'
import {
  Calendar,
  Plus,
  Trash2,
  Waves,
  Flame,
  PartyPopper,
  UtensilsCrossed,
  Trophy,
} from 'lucide-react'

const AREAS = [
  {
    id: 1,
    name: 'Salão de Festas',
    icon: PartyPopper,
  },
  {
    id: 2,
    name: 'Churrasqueira',
    icon: Flame,
  },
  {
    id: 3,
    name: 'Espaço Gourmet',
    icon: UtensilsCrossed,
  },
  {
    id: 4,
    name: 'Quadra Society',
    icon: Trophy,
  },
  {
    id: 5,
    name: 'Sauna',
    icon: Waves,
  },
]

export default function Bookings() {
  const [selectedArea, setSelectedArea] =
    useState('')

  const [date, setDate] = useState('')

  const [time, setTime] = useState('')

  const [reservations, setReservations] =
  useState([
    {
      id: 1,
      area: 'Espaço Gourmet',
      date: '2026-06-25',
      time: '18:00',
    },
  ])

  function createReservation() {
    if (
      !selectedArea ||
      !date ||
      !time
    ) {
      alert(
        'Preencha todos os campos.'
      )
      return
    }

    const newReservation = {
      id: Date.now(),
      area: selectedArea,
      date,
      time,
    }

    setReservations((prev) => [
      ...prev,
      newReservation,
    ])

    setSelectedArea('')
    setDate('')
    setTime('')
  }

  function removeReservation(id) {
    setReservations((prev) =>
      prev.filter((r) => r.id !== id)
    )
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            color: '#1e1b4b',
          }}
        >
          Reservas
        </h1>

        <p
          style={{
            marginTop: '6px',
            color: '#6b7280',
          }}
        >
          Reserve áreas comuns do
          condomínio.
        </p>
      </div>

      {/* Áreas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(220px,1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {AREAS.map((area) => {
          const Icon = area.icon

          return (
            <div
              key={area.id}
              onClick={() =>
                setSelectedArea(area.name)
              }
              style={{
                background:
                  selectedArea === area.name
                    ? '#ede9fe'
                    : '#ffffff',
                border:
                  selectedArea === area.name
                    ? '2px solid #7c3aed'
                    : '1px solid #ece9f5',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: '0.2s',
              }}
            >
              <Icon
                size={28}
                color="#7c3aed"
              />

              <h3
                style={{
                  marginBottom: '6px',
                  color: '#1e1b4b',
                }}
              >
                {area.name}
              </h3>

              <span
                style={{
                  color: '#16a34a',
                  fontSize: '14px',
                }}
              >
                Disponível
              </span>
            </div>
          )
        })}
      </div>

      {/* Formulário */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #ece9f5',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: '#1e1b4b',
          }}
        >
          Nova Reserva
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: '16px',
          }}
        >
          <div>
            <label>
              Área Selecionada
            </label>

            <input
              value={selectedArea}
              readOnly
              placeholder="Escolha uma área"
              style={inputStyle}
            />
          </div>

          <div>
            <label>Data</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <div>
            <label>Horário</label>

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={createReservation}
          style={buttonStyle}
        >
          <Plus size={18} />
          Confirmar Reserva
        </button>
      </div>

      {/* Minhas Reservas */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #ece9f5',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: '#1e1b4b',
          }}
        >
          Minhas Reservas
        </h2>

        {reservations.length === 0 ? (
          <p
            style={{
              color: '#6b7280',
            }}
          >
            Nenhuma reserva cadastrada.
          </p>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              style={{
                border:
                  '1px solid #ece9f5',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    color: '#1e1b4b',
                  }}
                >
                  {reservation.area}
                </h4>

                <p
                  style={{
                    margin: '6px 0',
                    color: '#6b7280',
                  }}
                >
                  <Calendar
                    size={14}
                    style={{
                      marginRight: '6px',
                    }}
                  />
                  {reservation.date}
                  {' - '}
                  {reservation.time}
                </p>
              </div>

              <button
                onClick={() =>
                  removeReservation(
                    reservation.id
                  )
                }
                style={{
                  border: 'none',
                  background:
                    '#fef2f2',
                  color: '#dc2626',
                  padding:
                    '10px 14px',
                  borderRadius:
                    '10px',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  marginTop: '6px',
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