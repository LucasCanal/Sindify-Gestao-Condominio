import { useState } from 'react'
import {
  Vote,
  Calendar,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react'

export default function Votes() {
  const [polls, setPolls] = useState([
    {
      id: 1,
      title: 'Instalação de câmeras adicionais?',
      vote: '',
      status: 'Ativa',
    },
    {
      id: 2,
      title: 'Pintura da fachada em 2027?',
      vote: '',
      status: 'Ativa',
    },
  ])

  function handleVote(id, value) {
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === id
          ? { ...poll, vote: value }
          : poll
      )
    )
  }

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
          Assembleias e Votações
        </h1>

        <p
          style={{
            color: '#6b7280',
            marginTop: 6,
          }}
        >
          Acompanhe reuniões,
          assembleias e decisões do
          condomínio.
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
          icon={Users}
          value="3"
          label="Assembleias"
        />

        <StatCard
          icon={Vote}
          value="2"
          label="Votações Ativas"
        />

        <StatCard
          icon={Calendar}
          value="25/06"
          label="Próxima Reunião"
        />

        <StatCard
          icon={CheckCircle}
          value="12"
          label="Decisões Concluídas"
        />
      </div>

      {/* Assembleia */}
      <div style={cardStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <Calendar
            size={22}
            color="#7c3aed"
          />

          <h2
            style={{
              margin: 0,
              color: '#1e1b4b',
            }}
          >
            Próxima Assembleia
          </h2>
        </div>

        <h3
          style={{
            color: '#1e1b4b',
          }}
        >
          Assembleia Geral Ordinária
        </h3>

        <p>
          📅 25/06/2026 às 19:30
        </p>

        <p>
          📍 Salão de Festas
        </p>

        <strong>Pauta:</strong>

        <ul>
          <li>Prestação de contas</li>
          <li>Obras da fachada</li>
          <li>Segurança</li>
        </ul>

        <button style={buttonStyle}>
          Confirmar Presença
        </button>
      </div>

      {/* Votações */}
      <div style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            color: '#1e1b4b',
          }}
        >
          Votações Abertas
        </h2>

        {polls.map((poll) => (
          <div
            key={poll.id}
            style={{
              border:
                '1px solid #ece9f5',
              borderRadius: 14,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3
              style={{
                color: '#1e1b4b',
              }}
            >
              {poll.title}
            </h3>

            <div
              style={{
                display: 'flex',
                gap: 16,
                marginTop: 12,
              }}
            >
              <label>
                <input
                  type="radio"
                  checked={
                    poll.vote === 'Sim'
                  }
                  onChange={() =>
                    handleVote(
                      poll.id,
                      'Sim'
                    )
                  }
                />
                Sim
              </label>

              <label>
                <input
                  type="radio"
                  checked={
                    poll.vote === 'Não'
                  }
                  onChange={() =>
                    handleVote(
                      poll.id,
                      'Não'
                    )
                  }
                />
                Não
              </label>
            </div>

            {poll.vote && (
              <p
                style={{
                  color: '#16a34a',
                  marginTop: 12,
                }}
              >
                ✓ Você votou:
                {' '}
                {poll.vote}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Histórico */}
      <div style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            color: '#1e1b4b',
          }}
        >
          Decisões Recentes
        </h2>

        <div style={historyCard}>
          <h4>
            Troca dos Elevadores
          </h4>

          <p>
            Resultado:
            {' '}
            <strong>
              Aprovado
            </strong>
          </p>

          <p>72% Sim</p>
          <p>28% Não</p>
        </div>

        <div style={historyCard}>
          <h4>
            Reforma do Hall
          </h4>

          <p>
            Resultado:
            {' '}
            <strong>
              Aprovado
            </strong>
          </p>

          <p>81% Sim</p>
          <p>19% Não</p>
        </div>
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
          margin: 0,
          color: '#6b7280',
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

const historyCard = {
  border: '1px solid #ece9f5',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
}

const buttonStyle = {
  marginTop: 16,
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '12px 18px',
  cursor: 'pointer',
}