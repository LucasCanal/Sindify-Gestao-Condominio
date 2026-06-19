import { useState } from 'react'
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function ServiceRequests() {
  const [title, setTitle] = useState('')
  const [category, setCategory] =
    useState('')

  const [priority, setPriority] =
    useState('Média')

  const [description, setDescription] =
    useState('')

  const [tickets, setTickets] = useState([
    {
      id: 245,
      title: 'Vazamento na garagem',
      category: 'Hidráulica',
      priority: 'Alta',
      status: 'Em andamento',
    },
    {
      id: 238,
      title:
        'Lâmpada queimada no corredor',
      category: 'Elétrica',
      priority: 'Baixa',
      status: 'Resolvido',
    },
  ])

  function createTicket() {
    if (
      !title ||
      !category ||
      !description
    ) {
      alert(
        'Preencha todos os campos.'
      )
      return
    }

    setTickets((prev) => [
      {
        id: Date.now(),
        title,
        category,
        priority,
        status: 'Aberto',
      },
      ...prev,
    ])

    setTitle('')
    setCategory('')
    setPriority('Média')
    setDescription('')
  }

  const openTickets = tickets.filter(
    (t) => t.status === 'Aberto'
  ).length

  const progressTickets =
    tickets.filter(
      (t) =>
        t.status === 'Em andamento'
    ).length

  const resolvedTickets =
    tickets.filter(
      (t) => t.status === 'Resolvido'
    ).length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            color: '#1e1b4b',
            fontSize: 30,
          }}
        >
          Chamados
        </h1>

        <p
          style={{
            color: '#6b7280',
          }}
        >
          Solicite suporte ou reporte
          problemas no condomínio.
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
        <StatCard
          icon={Wrench}
          value={tickets.length}
          label="Chamados"
        />

        <StatCard
          icon={AlertCircle}
          value={openTickets}
          label="Abertos"
        />

        <StatCard
          icon={Clock}
          value={progressTickets}
          label="Em andamento"
        />

        <StatCard
          icon={CheckCircle}
          value={resolvedTickets}
          label="Resolvidos"
        />
      </div>

      {/* Novo Chamado */}
      <div style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            color: '#1e1b4b',
          }}
        >
          Novo Chamado
        </h2>

        <div
          style={{
            display: 'grid',
            gap: 16,
          }}
        >
          <input
            placeholder="Título"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            style={inputStyle}
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option value="">
              Categoria
            </option>

            <option>
              Hidráulica
            </option>

            <option>
              Elétrica
            </option>

            <option>
              Limpeza
            </option>

            <option>
              Segurança
            </option>

            <option>
              Outros
            </option>
          </select>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
              )
            }
            style={inputStyle}
          >
            <option>Baixa</option>
            <option>Média</option>
            <option>Alta</option>
          </select>

          <textarea
            rows="4"
            placeholder="Descrição"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            onClick={createTicket}
            style={buttonStyle}
          >
            <Plus size={18} />
            Abrir Chamado
          </button>
        </div>
      </div>

      {/* Lista */}
      <div style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            color: '#1e1b4b',
          }}
        >
          Meus Chamados
        </h2>

        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            style={{
              border:
                '1px solid #ece9f5',
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <strong>
              #{ticket.id}
            </strong>

            <h4
              style={{
                marginBottom: 8,
                color: '#1e1b4b',
              }}
            >
              {ticket.title}
            </h4>

            <p
              style={{
                color: '#6b7280',
              }}
            >
              {ticket.category}
            </p>

            <span
              style={{
                background:
                  ticket.status ===
                  'Resolvido'
                    ? '#dcfce7'
                    : '#fef3c7',
                color:
                  ticket.status ===
                  'Resolvido'
                    ? '#166534'
                    : '#92400e',
                padding:
                  '6px 10px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {ticket.status}
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
        borderRadius: 16,
        padding: 20,
      }}
    >
      <Icon
        size={20}
        color="#7c3aed"
      />

      <h3
        style={{
          color: '#1e1b4b',
        }}
      >
        {value}
      </h3>

      <p
        style={{
          color: '#6b7280',
          margin: 0,
        }}
      >
        {label}
      </p>
    </div>
  )
}

const cardStyle = {
  background: '#fff',
  border: '1px solid #ece9f5',
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
}

const inputStyle = {
  width: '100%',
  padding: 12,
  border: '1px solid #d1d5db',
  borderRadius: 10,
}

const buttonStyle = {
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: 12,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
}