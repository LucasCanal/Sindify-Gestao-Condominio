import { useEffect, useState } from 'react'
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const CATEGORIES = [
  { value: 'eletrica', label: 'Elétrica' },
  { value: 'hidraulica', label: 'Hidráulica' },
  { value: 'estrutural', label: 'Estrutural' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'outros', label: 'Outros' },
]

const PRIORITIES = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
]

const STATUS = {
  aberto: { label: 'Aberto', bg: '#fef3c7', color: '#92400e' },
  em_andamento: { label: 'Em andamento', bg: '#dbeafe', color: '#2563eb' },
  concluido: { label: 'Resolvido', bg: '#dcfce7', color: '#166534' },
  cancelado: { label: 'Cancelado', bg: '#fee2e2', color: '#dc2626' },
}

const labelOf = (list, value) => list.find((i) => i.value === value)?.label || value

export default function ServiceRequests() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/service-requests/me')
      setTickets(data?.data?.serviceRequests || [])
    } catch (error) {
      console.error('Erro ao buscar chamados', error)
      toast.error(error.response?.data?.message || 'Erro ao buscar chamados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const createTicket = async () => {
    if (!title || !category || !priority || !description) {
      toast.error('Preencha título, categoria, prioridade e descrição.')
      return
    }
    try {
      await api.post('/service-requests', { title, category, priority, description })
      toast.success('Chamado aberto com sucesso')
      setTitle('')
      setCategory('')
      setPriority('')
      setDescription('')
      fetchTickets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao abrir chamado')
    }
  }

  const cancelTicket = async (id) => {
    try {
      await api.patch(`/service-requests/${id}/cancel`)
      toast.success('Chamado cancelado')
      fetchTickets()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cancelar chamado')
    }
  }

  const openTickets = tickets.filter((t) => t.status === 'aberto').length
  const progressTickets = tickets.filter((t) => t.status === 'em_andamento').length
  const resolvedTickets = tickets.filter((t) => t.status === 'concluido').length

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, color: '#1e1b4b', fontSize: 30 }}>Chamados</h1>
        <p style={{ color: '#6b7280' }}>Solicite suporte ou reporte problemas no condomínio.</p>
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Wrench} value={tickets.length} label="Chamados" />
        <StatCard icon={AlertCircle} value={openTickets} label="Abertos" />
        <StatCard icon={Clock} value={progressTickets} label="Em andamento" />
        <StatCard icon={CheckCircle} value={resolvedTickets} label="Resolvidos" />
      </div>

      {/* Novo Chamado */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#1e1b4b' }}>Novo Chamado</h2>

        <div style={{ display: 'grid', gap: 16 }}>
          <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

          <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Categoria</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle}>
            <option value="">Prioridade</option>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          <textarea rows="4" placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} style={inputStyle} />

          <button onClick={createTicket} style={buttonStyle}>
            <Plus size={18} />
            Abrir Chamado
          </button>
        </div>
      </div>

      {/* Lista */}
      <div style={cardStyle}>
        <h2 style={{ marginTop: 0, color: '#1e1b4b' }}>Meus Chamados</h2>

        {loading ? (
          <p style={{ color: '#6b7280' }}>Carregando chamados...</p>
        ) : tickets.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Nenhum chamado aberto.</p>
        ) : (
          tickets.map((ticket) => {
            const s = STATUS[ticket.status] || STATUS.aberto
            return (
              <div key={ticket._id} style={{ border: '1px solid #ece9f5', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px', color: '#1e1b4b' }}>{ticket.title}</h4>
                    <p style={{ color: '#6b7280', margin: 0 }}>
                      {labelOf(CATEGORIES, ticket.category)} • Prioridade: {labelOf(PRIORITIES, ticket.priority)}
                    </p>
                  </div>
                  <span style={{ background: s.bg, color: s.color, padding: '6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {s.label}
                  </span>
                </div>

                {ticket.description && (
                  <p style={{ color: '#374151', marginBottom: 0, marginTop: 10, lineHeight: 1.5 }}>{ticket.description}</p>
                )}

                {['aberto', 'em_andamento'].includes(ticket.status) && (
                  <button
                    onClick={() => cancelTicket(ticket._id)}
                    style={{ marginTop: 12, border: 'none', background: '#fef2f2', color: '#dc2626', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13 }}
                  >
                    <Trash2 size={15} /> Cancelar
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: 16, padding: 20 }}>
      <Icon size={20} color="#7c3aed" />
      <h3 style={{ color: '#1e1b4b' }}>{value}</h3>
      <p style={{ color: '#6b7280', margin: 0 }}>{label}</p>
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
  boxSizing: 'border-box',
  color: '#9ca3af',
  fontWeight: 300,
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