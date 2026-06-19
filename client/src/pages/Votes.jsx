import { useEffect, useMemo, useState } from 'react'
import {
  Vote as VoteIcon,
  Users,
  CheckCircle,
  Clock,
  Plus,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

export default function Votes() {
  const { user } = useAuthStore()
  const isSindico = user?.role === 'sindico'
  const userId = (user?._id || user?.id || '').toString()

  const [polls, setPolls] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])

  const fetchPolls = async () => {
    try {
      const { data } = await api.get('/votes')
      setPolls(data?.data?.data || [])
    } catch (error) {
      console.error('Erro ao buscar votações', error)
      toast.error(error.response?.data?.message || 'Erro ao buscar votações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const votedOption = (poll) =>
    poll.options.findIndex((opt) =>
      (opt.votes || []).map((v) => (v?._id || v).toString()).includes(userId)
    )

  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.post(`/votes/${pollId}/vote`, { optionIndex })
      toast.success('Voto registrado com sucesso')
      fetchPolls()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao registrar voto')
    }
  }

  const handleClose = async (pollId) => {
    try {
      await api.patch(`/votes/${pollId}/close`)
      toast.success('Enquete encerrada')
      fetchPolls()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao encerrar enquete')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const cleanOptions = options.map((o) => o.trim()).filter(Boolean)
    if (cleanOptions.length < 2) {
      toast.error('Informe pelo menos 2 opções.')
      return
    }
    try {
      await api.post('/votes', { title, description, options: cleanOptions })
      toast.success('Enquete criada com sucesso')
      setTitle('')
      setDescription('')
      setOptions(['', ''])
      setIsModalOpen(false)
      fetchPolls()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar enquete')
    }
  }

  const open = polls.filter((p) => p.status === 'aberta')
  const closed = polls.filter((p) => p.status === 'encerrada')
  const myVotes = useMemo(
    () => polls.filter((p) => votedOption(p) >= 0).length,
    [polls, userId]
  )

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, color: '#1e1b4b' }}>Assembleias e Votações</h1>
          <p style={{ color: '#6b7280', marginTop: 6 }}>Acompanhe e participe das decisões do condomínio.</p>
        </div>
        {isSindico && (
          <button onClick={() => setIsModalOpen(true)} style={{ ...buttonStyle, marginTop: 0 }}>
            <Plus size={16} /> Nova Votação
          </button>
        )}
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Users} value={polls.length} label="Votações" />
        <StatCard icon={VoteIcon} value={open.length} label="Abertas" />
        <StatCard icon={Clock} value={closed.length} label="Encerradas" />
        <StatCard icon={CheckCircle} value={myVotes} label="Meus Votos" />
      </div>

      {/* Votações Abertas */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#1e1b4b' }}>Votações Abertas</h2>

        {loading ? (
          <p style={{ color: '#6b7280' }}>Carregando votações...</p>
        ) : open.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Nenhuma votação aberta.</p>
        ) : (
          open.map((poll) => {
            const myVote = votedOption(poll)
            const hasVoted = myVote >= 0
            const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || []).length, 0)
            return (
              <div key={poll._id} style={{ border: '1px solid #ece9f5', borderRadius: 14, padding: 20, marginBottom: 16 }}>
                <h3 style={{ color: '#1e1b4b', marginTop: 0 }}>{poll.title}</h3>
                {poll.description && <p style={{ color: '#6b7280', marginTop: 0 }}>{poll.description}</p>}

                <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                  {poll.options.map((opt, idx) => {
                    const count = (opt.votes || []).length
                    const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0
                    return (
                      <div key={idx}>
                        {hasVoted ? (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#374151', marginBottom: 4 }}>
                              <span>{opt.label} {myVote === idx ? '✓' : ''}</span>
                              <span>{pct}% ({count})</span>
                            </div>
                            <div style={{ background: '#f1eefb', borderRadius: 999, height: 8 }}>
                              <div style={{ width: `${pct}%`, background: '#7c3aed', height: 8, borderRadius: 999 }} />
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => handleVote(poll._id, idx)} style={optionButton}>
                            {opt.label}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                {hasVoted && (
                  <p style={{ color: '#16a34a', marginTop: 12, marginBottom: 0 }}>✓ Você já votou nesta enquete.</p>
                )}

                {isSindico && (
                  <button onClick={() => handleClose(poll._id)} style={closeButton}>Encerrar votação</button>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Decisões / Encerradas */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#1e1b4b' }}>Decisões Recentes</h2>

        {closed.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Nenhuma votação encerrada.</p>
        ) : (
          closed.map((poll) => {
            const totalVotes = poll.options.reduce((sum, o) => sum + (o.votes || []).length, 0)
            const winner = [...poll.options].sort((a, b) => (b.votes || []).length - (a.votes || []).length)[0]
            return (
              <div key={poll._id} style={historyCard}>
                <h4 style={{ margin: '0 0 6px', color: '#1e1b4b' }}>{poll.title}</h4>
                <p style={{ margin: '0 0 8px', color: '#6b7280' }}>
                  Mais votado: <strong>{winner?.label || '—'}</strong>
                </p>
                {poll.options.map((opt, idx) => {
                  const count = (opt.votes || []).length
                  const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0
                  return (
                    <p key={idx} style={{ margin: '2px 0', color: '#6b7280', fontSize: 14 }}>
                      {opt.label}: {pct}% ({count})
                    </p>
                  )
                })}
              </div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 24, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: '#1e1b4b' }}>Nova Votação</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required style={modalInput} />
              <textarea placeholder="Descrição" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} style={modalInput} />

              <div style={{ display: 'grid', gap: 8 }}>
                <label style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>Opções</label>
                {options.map((opt, idx) => (
                  <input
                    key={idx}
                    placeholder={`Opção ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const next = [...options]
                      next[idx] = e.target.value
                      setOptions(next)
                    }}
                    style={modalInput}
                  />
                ))}
                <button type="button" onClick={() => setOptions([...options, ''])} style={{ ...optionButton, marginTop: 0 }}>
                  + Adicionar opção
                </button>
              </div>

              <button type="submit" style={buttonStyle}>Criar Votação</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: 16, padding: 20 }}>
      <Icon size={20} color="#7c3aed" />
      <h3 style={{ color: '#1e1b4b' }}>{value}</h3>
      <p style={{ margin: 0, color: '#6b7280' }}>{label}</p>
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
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
}

const optionButton = {
  width: '100%',
  textAlign: 'left',
  background: '#faf9ff',
  border: '1px solid #ece9f5',
  borderRadius: 10,
  padding: '12px 14px',
  cursor: 'pointer',
  color: '#1e1b4b',
  fontSize: 14,
}

const closeButton = {
  marginTop: 14,
  background: '#fff',
  color: '#dc2626',
  border: '1px solid #fecaca',
  borderRadius: 10,
  padding: '8px 14px',
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 13,
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

const modalInput = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: 14,
  color: '#000',
  boxSizing: 'border-box',
}
