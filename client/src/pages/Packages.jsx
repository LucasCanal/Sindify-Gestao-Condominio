import { useEffect, useMemo, useState } from 'react'
import {
  Package,
  Clock,
  CheckCircle,
  Search,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const STATUS_LABEL = {
  aguardando: 'Aguardando Retirada',
  retirado: 'Retirada',
  devolvido: 'Devolvida',
}

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchPackages = async () => {
    try {
      const { data } = await api.get('/packages/me')
      setPackages(data?.data?.packages || [])
    } catch (error) {
      console.error('Erro ao buscar encomendas', error)
      toast.error(error.response?.data?.message || 'Erro ao buscar encomendas')
      setPackages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleWithdraw = async (id) => {
    try {
      await api.patch(`/packages/${id}/withdraw`)
      toast.success('Encomenda marcada como retirada')
      fetchPackages()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao retirar encomenda')
    }
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const now = new Date()
    return {
      aguardando: packages.filter((p) => p.status === 'aguardando').length,
      hoje: packages.filter((p) => new Date(p.createdAt).toDateString() === today).length,
      mes: packages.filter((p) => {
        const d = new Date(p.createdAt)
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
    }
  }, [packages])

  const filtered = packages.filter((p) => {
    const text = `${p.sender || ''} ${p.recipientName || ''} ${p.trackingCode || ''}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, color: '#1e1b4b', fontSize: '30px' }}>Encomendas</h1>
        <p style={{ marginTop: '6px', color: '#6b7280' }}>Acompanhe suas entregas e retiradas.</p>
      </div>

      {/* Resumo */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <StatCard icon={Package} value={stats.aguardando} label="Aguardando" />
        <StatCard icon={Clock} value={stats.hoje} label="Recebidas Hoje" />
        <StatCard icon={CheckCircle} value={stats.mes} label="No Mês" />
      </div>

      {/* Busca */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #ece9f5',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}
      >
        <Search size={18} color="#9ca3af" />
        <input
          placeholder="Buscar encomenda..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%' }}
        />
      </div>

      {/* Encomendas */}
      {loading ? (
        <p style={{ color: '#6b7280' }}>Carregando encomendas...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Nenhuma encomenda encontrada.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filtered.map((pkg) => (
            <PackageCard key={pkg._id} pkg={pkg} onWithdraw={handleWithdraw} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: '14px', padding: '20px' }}>
      <Icon size={20} color="#7c3aed" />
      <h2 style={{ marginBottom: '4px', color: '#1e1b4b' }}>{value}</h2>
      <p style={{ margin: 0, color: '#6b7280' }}>{label}</p>
    </div>
  )
}

function PackageCard({ pkg, onWithdraw }) {
  const isWithdrawn = pkg.status !== 'aguardando'
  const label = STATUS_LABEL[pkg.status] || pkg.status
  return (
    <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: '14px', padding: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '6px', color: '#1e1b4b' }}>{pkg.sender || 'Encomenda'}</h3>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Recebido em: {new Date(pkg.createdAt).toLocaleString('pt-BR')}
          </p>
          {pkg.recipientName && <p style={{ color: '#6b7280', margin: '4px 0 0' }}>Destinatário: {pkg.recipientName}</p>}
          {pkg.trackingCode && <p style={{ color: '#6b7280', margin: '4px 0 0' }}>Código: {pkg.trackingCode}</p>}
        </div>
        <span
          style={{
            background: isWithdrawn ? '#dcfce7' : '#fef3c7',
            color: isWithdrawn ? '#166534' : '#92400e',
            padding: '6px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>

      {pkg.status === 'aguardando' && (
        <button
          onClick={() => onWithdraw(pkg._id)}
          style={{
            marginTop: '14px',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '10px',
            background: '#7c3aed',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          Marcar como retirada
        </button>
      )}
    </div>
  )
}
