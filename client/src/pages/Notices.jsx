import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  AlertTriangle,
  Eye,
  Plus,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const CATEGORIES = [
  { value: 'informativo', label: 'Informativo', bg: '#dbeafe', color: '#2563eb' },
  { value: 'urgente', label: 'Urgente', bg: '#fee2e2', color: '#dc2626' },
  { value: 'manutencao', label: 'Manutenção', bg: '#fef3c7', color: '#d97706' },
  { value: 'assembleia', label: 'Assembleia', bg: '#ede9fe', color: '#7c3aed' },
  { value: 'financeiro', label: 'Financeiro', bg: '#dcfce7', color: '#16a34a' },
]

const categoryInfo = (value) =>
  CATEGORIES.find((c) => c.value === value) || CATEGORIES[0]

export default function Notices() {
  const { user } = useAuthStore()
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('informativo')

  const canCreate = ['sindico', 'conselheiro'].includes(user?.role)

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notices')
      setNotices(data?.data?.data || [])
    } catch (error) {
      console.error('Erro ao buscar avisos', error)
      toast.error(error.response?.data?.message || 'Erro ao buscar avisos')
      setNotices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [])

  const userId = user?._id || user?.id

  const isRead = (notice) =>
    (notice.readBy || []).some((r) => (r.user?._id || r.user) === userId)

  const handleToggleRead = async (id) => {
    try {
      await api.patch(`/notices/${id}/read`)
      fetchNotices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status de leitura')
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/notices', { title, content, category })
      toast.success('Aviso publicado com sucesso')
      setTitle('')
      setContent('')
      setCategory('informativo')
      setIsModalOpen(false)
      fetchNotices()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao publicar aviso')
    }
  }

  const stats = useMemo(
    () => ({
      total: notices.length,
      naoLidos: notices.filter((n) => !isRead(n)).length,
      urgentes: notices.filter((n) => n.category === 'urgente').length,
    }),
    [notices, user]
  )

  const urgent = notices.find((n) => n.category === 'urgente')

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '30px', color: '#1e1b4b' }}>Avisos</h1>
          <p style={{ marginTop: '6px', color: '#6b7280' }}>Comunicados e informações importantes do condomínio.</p>
        </div>
        {canCreate && (
          <button onClick={() => setIsModalOpen(true)} style={primaryBtnStyle}>
            <Plus size={16} /> Novo Aviso
          </button>
        )}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={Bell} value={stats.total} label="Avisos Totais" />
        <StatCard icon={Eye} value={stats.naoLidos} label="Não Lidos" />
        <StatCard icon={AlertTriangle} value={stats.urgentes} label="Urgentes" />
      </div>

      {/* Aviso Urgente */}
      {urgent && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <AlertTriangle size={22} color="#dc2626" />
            <span style={{ color: '#dc2626', fontWeight: '700' }}>AVISO URGENTE</span>
          </div>
          <h2 style={{ margin: '0 0 10px', color: '#7f1d1d' }}>{urgent.title}</h2>
          <p style={{ margin: 0, color: '#991b1b' }}>{urgent.content}</p>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Carregando avisos...</p>
      ) : notices.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Nenhum aviso publicado.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {notices.map((notice) => (
            <NoticeCard
              key={notice._id}
              notice={notice}
              read={isRead(notice)}
              onToggleRead={handleToggleRead}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1e1b4b' }}>Novo Aviso</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Título</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Conteúdo</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit" style={primaryBtnStyle}>Publicar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '20px' }}>
      <Icon size={20} color="#7c3aed" />
      <h2 style={{ margin: '10px 0 4px', color: '#1e1b4b' }}>{value}</h2>
      <p style={{ margin: 0, color: '#6b7280' }}>{label}</p>
    </div>
  )
}

function NoticeCard({ notice, read, onToggleRead }) {
  const cat = categoryInfo(notice.category)
  return (
    <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0, color: '#1e1b4b' }}>{notice.title}</h3>
        <span style={{ background: cat.bg, color: cat.color, padding: '6px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' }}>
          {cat.label}
        </span>
      </div>
      <p style={{ color: '#6b7280', marginTop: 0 }}>
        {new Date(notice.createdAt).toLocaleDateString('pt-BR')}
        {notice.author?.name ? ` • ${notice.author.name}` : ''}
      </p>
      <p style={{ marginBottom: 0, color: '#374151', lineHeight: '1.6' }}>{notice.content}</p>

      <div style={{ marginTop: '14px' }}>
        {read ? (
          <button onClick={() => onToggleRead(notice._id)} style={readBtnStyle}>
            <Eye size={15} /> Lido
          </button>
        ) : (
          <button onClick={() => onToggleRead(notice._id)} style={outlineBtnStyle}>
            Marcar como lido
          </button>
        )}
      </div>
    </div>
  )
}

const primaryBtnStyle = {
  padding: '10px 16px',
  border: 'none',
  borderRadius: '10px',
  background: '#7c3aed',
  color: '#fff',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: '600',
  fontSize: '14px',
}

const outlineBtnStyle = {
  padding: '8px 14px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  background: '#fff',
  color: '#374151',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '13px',
}

const readBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  color: '#16a34a',
  fontSize: '13px',
  fontWeight: '600',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
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

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  marginBottom: '6px',
  color: '#374151',
  fontWeight: '500',
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: '14px',
  color: '#000',
  boxSizing: 'border-box',
}