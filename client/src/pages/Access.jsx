import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  UserPlus,
  Users,
  Briefcase,
  Calendar,
  QrCode,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const TYPE_LABEL = {
  morador: 'Morador',
  visitante: 'Visitante',
  entregador: 'Entregador',
  prestador: 'Prestador',
}

export default function Access() {
  const { user } = useAuthStore()
  const canManage = ['sindico', 'porteiro'].includes(user?.role)

  const [logs, setLogs] = useState([])
  const [apartments, setApartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState(user?.qrCode || '')

  // Formulário de registro de visitante
  const [visitorName, setVisitorName] = useState('')
  const [visitorDoc, setVisitorDoc] = useState('')
  const [apartmentId, setApartmentId] = useState('')
  const [direction, setDirection] = useState('entrada')
  const [notes, setNotes] = useState('')

  const fetchLogs = async () => {
    try {
      const endpoint = canManage ? '/access' : '/access/me'
      const { data } = await api.get(endpoint)
      setLogs(data?.data?.data || [])
    } catch (error) {
      console.error('Erro ao buscar acessos', error)
      toast.error(error.response?.data?.message || 'Erro ao buscar acessos')
    } finally {
      setLoading(false)
    }
  }

  const fetchApartments = async () => {
    if (!canManage) return
    try {
      const { data } = await api.get('/apartments')
      setApartments(data?.data?.data || [])
    } catch (error) {
      console.error('Erro ao buscar apartamentos', error)
    }
  }

  useEffect(() => {
    fetchLogs()
    fetchApartments()
  }, [])

  useEffect(() => {
    if (user?.qrCode) setQrCode(user.qrCode)
  }, [user])

  const registerVisitor = async () => {
    if (!visitorName || !apartmentId) {
      toast.error('Informe o nome do visitante e o apartamento.')
      return
    }
    try {
      await api.post('/access/visitor', {
        visitorName,
        visitorDoc,
        apartmentId,
        direction,
        notes,
      })
      toast.success('Acesso registrado com sucesso')
      setVisitorName('')
      setVisitorDoc('')
      setApartmentId('')
      setDirection('entrada')
      setNotes('')
      fetchLogs()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao registrar acesso')
    }
  }

  const regenerateQR = async () => {
    try {
      const { data } = await api.post('/access/regenerate-qr')
      setQrCode(data?.data?.qrCode || '')
      toast.success('QR Code atualizado')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao gerar QR Code')
    }
  }

  const today = new Date().toDateString()
  const visitors = logs.filter((a) => a.type === 'visitante').length
  const providers = logs.filter((a) => ['prestador', 'entregador'].includes(a.type)).length
  const todayEntries = logs.filter((a) => new Date(a.createdAt).toDateString() === today).length

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 30, color: '#1e1b4b' }}>Controle de Acessos</h1>
        <p style={{ marginTop: 6, color: '#6b7280' }}>
          {canManage ? 'Registre entradas e acompanhe os acessos do condomínio.' : 'Acompanhe seu histórico de acessos e seu QR Code.'}
        </p>
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
        <SummaryCard icon={Users} title="Visitantes" value={visitors} />
        <SummaryCard icon={Briefcase} title="Prestadores / Entregas" value={providers} />
        <SummaryCard icon={Calendar} title="Acessos Hoje" value={todayEntries} />
        <SummaryCard icon={ShieldCheck} title="Total de Registros" value={logs.length} />
      </div>

      {/* Meu QR Code */}
      <div style={sectionStyle}>
        <h2 style={sectionTitle}>Meu QR Code de Acesso</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {qrCode ? (
            <img src={qrCode} alt="QR Code" style={{ width: 120, height: 120, border: '1px solid #ece9f5', borderRadius: 12, padding: 6, background: '#fff' }} />
          ) : (
            <div style={{ width: 120, height: 120, border: '1px dashed #d1d5db', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
              <QrCode size={32} />
            </div>
          )}
          <div>
            <p style={{ color: '#6b7280', marginTop: 0 }}>Apresente este código na portaria para registrar sua entrada.</p>
            <button onClick={regenerateQR} style={{ ...buttonStyle, marginTop: 0 }}>
              <RefreshCw size={16} /> Gerar Novo QR Code
            </button>
          </div>
        </div>
      </div>

      {/* Formulário (porteiro/síndico) */}
      {canManage && (
        <div style={sectionStyle}>
          <h2 style={sectionTitle}>Registrar Acesso de Visitante</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
            <input placeholder="Nome do visitante" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} style={inputStyle} />
            <input placeholder="Documento (CPF/RG)" value={visitorDoc} onChange={(e) => setVisitorDoc(e.target.value)} style={inputStyle} />
            <select value={apartmentId} onChange={(e) => setApartmentId(e.target.value)} style={inputStyle}>
              <option value="">Apartamento</option>
              {apartments.map((apt) => (
                <option key={apt._id} value={apt._id}>
                  {apt.number}{apt.block ? ` - Bloco ${apt.block}` : ''}
                </option>
              ))}
            </select>
            <select value={direction} onChange={(e) => setDirection(e.target.value)} style={inputStyle}>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
          </div>

          <textarea rows="3" placeholder="Observações" value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, marginTop: 16 }} />

          <button onClick={registerVisitor} style={buttonStyle}>
            <UserPlus size={18} />
            Registrar Acesso
          </button>
        </div>
      )}

      {/* Histórico */}
      <div>
        <h2 style={{ color: '#1e1b4b', marginBottom: 16 }}>
          {canManage ? 'Acessos Recentes' : 'Meu Histórico de Acessos'}
        </h2>

        {loading ? (
          <p style={{ color: '#6b7280' }}>Carregando acessos...</p>
        ) : logs.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Nenhum acesso registrado.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
            {logs.map((item) => (
              <div key={item._id} style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 8 }}>
                  <span style={{ background: item.direction === 'saida' ? '#fee2e2' : '#dcfce7', color: item.direction === 'saida' ? '#dc2626' : '#166534', padding: '6px 10px', borderRadius: '999px', fontSize: 12, fontWeight: 600 }}>
                    {item.direction === 'saida' ? 'Saída' : 'Entrada'}
                  </span>
                  <span style={{ color: '#9ca3af', fontSize: 12 }}>{TYPE_LABEL[item.type] || item.type}</span>
                </div>

                <h3 style={{ margin: 0, color: '#1e1b4b' }}>{item.user?.name || item.visitorName || 'Acesso'}</h3>

                <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
                  <InfoLine label="Data" value={new Date(item.createdAt).toLocaleString('pt-BR')} />
                  <InfoLine label="Apartamento" value={item.apartment?.number ? `${item.apartment.number}${item.apartment.block ? ` - Bloco ${item.apartment.block}` : ''}` : 'Não informado'} />
                  {item.visitorDoc && <InfoLine label="Documento" value={item.visitorDoc} />}
                  <InfoLine label="Observação" value={item.notes || 'Nenhuma'} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ icon: Icon, title, value }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ece9f5', borderRadius: 16, padding: 20 }}>
      <Icon size={22} color="#7c3aed" />
      <h2 style={{ margin: '10px 0 4px', color: '#1e1b4b' }}>{value}</h2>
      <p style={{ margin: 0, color: '#6b7280' }}>{title}</p>
    </div>
  )
}

function InfoLine({ label, value }) {
  return (
    <div>
      <strong style={{ color: '#374151' }}>{label}:</strong>{' '}
      <span style={{ color: '#6b7280' }}>{value}</span>
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
  boxSizing: 'border-box',
}

const buttonStyle = {
  marginTop: 20,
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
