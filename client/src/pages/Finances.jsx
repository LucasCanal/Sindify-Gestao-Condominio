import { useEffect, useState } from 'react'
import {
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const CATEGORIES = [
  'condominio',
  'manutencao',
  'limpeza',
  'seguranca',
  'energia',
  'agua',
  'outros',
]

const formatBRL = (value) =>
  (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Finances() {
  const { user } = useAuthStore()
  const canManage = user?.role === 'sindico'
  const canView = ['sindico', 'conselheiro'].includes(user?.role)

  const [summary, setSummary] = useState({ receitas: 0, despesas: 0, saldo: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [forbidden, setForbidden] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [type, setType] = useState('receita')
  const [category, setCategory] = useState('condominio')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  const fetchData = async () => {
    try {
      const [summaryRes, listRes] = await Promise.all([
        api.get('/finances/summary'),
        api.get('/finances'),
      ])
      setSummary(summaryRes?.data?.data?.mes || { receitas: 0, despesas: 0, saldo: 0 })
      setTransactions(listRes?.data?.data?.data || [])
    } catch (error) {
      if (error.response?.status === 403) {
        setForbidden(true)
      } else {
        console.error('Erro ao buscar finanças', error)
        toast.error(error.response?.data?.message || 'Erro ao buscar finanças')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (canView) fetchData()
    else {
      setForbidden(true)
      setLoading(false)
    }
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/finances', {
        type,
        category,
        description,
        amount: Number(amount),
        date,
      })
      toast.success('Lançamento criado com sucesso')
      setDescription('')
      setAmount('')
      setIsModalOpen(false)
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar lançamento')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remover este lançamento?')) return
    try {
      await api.delete(`/finances/${id}`)
      toast.success('Lançamento removido')
      fetchData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao remover lançamento')
    }
  }

  if (loading) return <p style={{ color: '#6b7280' }}>Carregando finanças...</p>

  if (forbidden) {
    return (
      <div>
        <h1 style={{ margin: 0, fontSize: '30px', color: '#1e1b4b' }}>Finanças</h1>
        <p style={{ marginTop: '12px', color: '#6b7280' }}>
          As finanças do condomínio estão disponíveis apenas para o síndico e conselheiros.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '30px', color: '#1e1b4b' }}>Finanças</h1>
          <p style={{ marginTop: '6px', color: '#6b7280' }}>Receitas, despesas e lançamentos do condomínio.</p>
        </div>
        {canManage && (
          <button onClick={() => setIsModalOpen(true)} style={primaryBtnStyle}>
            <Plus size={16} /> Novo Lançamento
          </button>
        )}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard icon={Wallet} value={formatBRL(summary.saldo)} label="Saldo do Mês" />
        <StatCard icon={TrendingUp} value={formatBRL(summary.receitas)} label="Receitas do Mês" />
        <StatCard icon={TrendingDown} value={formatBRL(summary.despesas)} label="Despesas do Mês" />
        <StatCard icon={Receipt} value={transactions.length} label="Lançamentos" />
      </div>

      {/* Histórico */}
      <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ marginTop: 0, color: '#1e1b4b' }}>Histórico de Lançamentos</h3>

        {transactions.length === 0 ? (
          <p style={{ color: '#9ca3af', margin: 0 }}>Nenhum lançamento registrado.</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t._id}
              style={{
                padding: '14px 0',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div>
                <strong style={{ color: '#1e1b4b' }}>{t.description}</strong>
                <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '13px' }}>
                  {t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: t.type === 'receita' ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                  {t.type === 'receita' ? '+' : '-'} {formatBRL(t.amount)}
                </span>
                {canManage && (
                  <button onClick={() => handleDelete(t._id)} style={deleteBtnStyle}><Trash2 size={16} /></button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div style={overlayStyle}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1e1b4b' }}>Novo Lançamento</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Descrição</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Valor (R$)</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Data</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
              </div>
              <button type="submit" style={primaryBtnStyle}>Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '20px' }}>
      <Icon size={20} color="#7c3aed" />
      <h3 style={{ margin: '10px 0 4px', color: '#1e1b4b' }}>{value}</h3>
      <p style={{ margin: 0, color: '#6b7280' }}>{label}</p>
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

const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  cursor: 'pointer',
  padding: '4px',
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
