import { useState } from 'react'
import {
  ShieldCheck,
  UserPlus,
  Users,
  Briefcase,
  Car,
  Calendar,
  Trash2,
} from 'lucide-react'

export default function Access() {
  const [name, setName] = useState('')
  const [type, setType] = useState('Visitante')
  const [date, setDate] = useState('')
  const [plate, setPlate] = useState('')
  const [notes, setNotes] = useState('')

  const [accesses, setAccesses] = useState([
    {
      id: 1,
      name: 'João Silva',
      type: 'Visitante',
      date: '2026-06-20',
      plate: 'ABC1D23',
      notes: 'Aniversário',
      status: 'Autorizado',
    },
    {
      id: 2,
      name: 'Carlos Eletricista',
      type: 'Prestador',
      date: '2026-06-21',
      plate: '',
      notes: 'Manutenção elétrica',
      status: 'Autorizado',
    },
  ])

  function createAccess() {
    if (!name || !date) {
      alert('Preencha nome e data.')
      return
    }

    const newAccess = {
      id: Date.now(),
      name,
      type,
      date,
      plate,
      notes,
      status: 'Autorizado',
    }

    setAccesses((prev) => [
      newAccess,
      ...prev,
    ])

    setName('')
    setDate('')
    setPlate('')
    setNotes('')
    setType('Visitante')
  }

  function removeAccess(id) {
    setAccesses((prev) =>
      prev.filter((item) => item.id !== id)
    )
  }

  const visitors = accesses.filter(
    (a) => a.type === 'Visitante'
  ).length

  const providers = accesses.filter(
    (a) => a.type === 'Prestador'
  ).length

  const today =
    new Date().toISOString().split('T')[0]

  const todayEntries = accesses.filter(
    (a) => a.date === today
  ).length

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            color: '#1e1b4b',
          }}
        >
          Controle de Acessos
        </h1>

        <p
          style={{
            marginTop: 6,
            color: '#6b7280',
          }}
        >
          Autorize visitantes e
          prestadores para sua unidade.
        </p>
      </div>

      {/* Resumo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(220px,1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <SummaryCard
          icon={Users}
          title="Visitantes"
          value={visitors}
        />

        <SummaryCard
          icon={Briefcase}
          title="Prestadores"
          value={providers}
        />

        <SummaryCard
          icon={Calendar}
          title="Entradas Hoje"
          value={todayEntries}
        />

        <SummaryCard
          icon={ShieldCheck}
          title="Autorizações"
          value={accesses.length}
        />
      </div>

      {/* Formulário */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>
          Nova Autorização
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: 16,
          }}
        >
          <input
            placeholder="Nome"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
            style={inputStyle}
          >
            <option>Visitante</option>
            <option>Prestador</option>
            <option>Entregador</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            style={inputStyle}
          />

          <input
            placeholder="Placa do veículo"
            value={plate}
            onChange={(e) =>
              setPlate(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <textarea
          rows="3"
          placeholder="Observações"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          style={{
            ...inputStyle,
            marginTop: 16,
          }}
        />

        <button
          onClick={createAccess}
          style={buttonStyle}
        >
          <UserPlus size={18} />
          Autorizar Entrada
        </button>
      </div>

      {/* Autorizações */}
      <div>
        <h2
          style={{
            color: '#1e1b4b',
            marginBottom: 16,
          }}
        >
          Autorizações Ativas
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(320px,1fr))',
            gap: 16,
          }}
        >
          {accesses.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff',
                border:
                  '1px solid #ece9f5',
                borderRadius: 16,
                padding: 20,
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    background:
                      '#dcfce7',
                    color: '#166534',
                    padding:
                      '6px 10px',
                    borderRadius:
                      '999px',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Autorizado
                </span>

                <button
                  onClick={() =>
                    removeAccess(item.id)
                  }
                  style={{
                    border: 'none',
                    background:
                      '#fef2f2',
                    color: '#dc2626',
                    borderRadius: 8,
                    cursor: 'pointer',
                    padding: 8,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3
                style={{
                  margin: 0,
                  color: '#1e1b4b',
                }}
              >
                {item.name}
              </h3>

              <p
                style={{
                  color: '#6b7280',
                  marginTop: 6,
                }}
              >
                {item.type}
              </p>

              <div
                style={{
                  marginTop: 16,
                  display: 'grid',
                  gap: 8,
                }}
              >
                <InfoLine
                  label="Data"
                  value={item.date}
                />

                <InfoLine
                  label="Placa"
                  value={
                    item.plate ||
                    'Não informado'
                  }
                />

                <InfoLine
                  label="Observação"
                  value={
                    item.notes ||
                    'Nenhuma'
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #ece9f5',
        borderRadius: 16,
        padding: 20,
      }}
    >
      <Icon
        size={22}
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
        {title}
      </p>
    </div>
  )
}

function InfoLine({
  label,
  value,
}) {
  return (
    <div>
      <strong
        style={{
          color: '#374151',
        }}
      >
        {label}:
      </strong>{' '}
      <span
        style={{
          color: '#6b7280',
        }}
      >
        {value}
      </span>
    </div>
  )
}

const sectionStyle = {
  background: '#fff',
  border: '1px solid #ece9f5',
  borderRadius: 16,
  padding: 24,
  marginBottom: 32,
}

const sectionTitle = {
  marginTop: 0,
  color: '#1e1b4b',
}

const inputStyle = {
  width: '100%',
  padding: 12,
  border: '1px solid #d1d5db',
  borderRadius: 10,
}

const buttonStyle = {
  marginTop: 20,
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}