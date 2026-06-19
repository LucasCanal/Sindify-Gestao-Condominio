import { useEffect, useState } from 'react'
import { Home, Users, UserPlus, PawPrint, Phone, Plus, Trash2, X, Car } from 'lucide-react'
import api from '../services/api'

const SectionCard = ({ title, icon: Icon, children, onAdd, showAddButton, addLabel }) => (
  <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
      <Icon size={20} color="#7c3aed" />
      <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '18px' }}>{title}</h3>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {children}
    </div>
    {showAddButton && (
      <button onClick={onAdd} style={buttonStyle}>
        <Plus size={16} /> {addLabel || 'Adicionar Item'}
      </button>
    )}
  </div>
)

const InfoItem = ({ label, value }) => (
  <div>
    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{label}</p>
    <strong style={{ color: '#1e1b4b', fontSize: '15px' }}>{value ?? '—'}</strong>
  </div>
)

export default function Apartments() {
  const [unitData, setUnitData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Controle da tela de criação de unidade (quando o usuário ainda não tem uma)
  const [showCreateUnit, setShowCreateUnit] = useState(false)
  const [unitNumber, setUnitNumber] = useState('')
  const [unitBlock, setUnitBlock] = useState('')
  const [unitFloor, setUnitFloor] = useState('')
  const [unitArea, setUnitArea] = useState('')
  const [unitType, setUnitType] = useState('Residencial')

  // Sub-listas (Sub-CRUDS da unidade)
  const [residents, setResidents] = useState([])
  const [visitors, setVisitors] = useState([])
  const [pets, setPets] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [emergencyContacts, setEmergencyContacts] = useState([])

  // Controle de Modal genérico
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('') // 'resident', 'visitor', 'pet', 'vehicle', 'emergency'

  // Estados do formulário do modal
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [docDate, setDocDate] = useState('')
  const [type, setType] = useState('')
  const [plate, setPlate] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyKinship, setEmergencyKinship] = useState('')

  const fetchUnitDetails = async () => {
    try {
      const { data } = await api.get('/apartments/my-unit')
      const unit = data?.data?.apartment || {}
      setUnitData(unit)

      setResidents(unit.residentsInfo || [])
      setVisitors(unit.visitors || [])
      setPets(unit.pets || [])
      setVehicles(unit.vehicles || [])
      setEmergencyContacts(unit.emergencyContacts || [])
      setShowCreateUnit(false)
    } catch (error) {
      if (error.response?.status === 404) {
        setUnitData(null)
        setShowCreateUnit(true)
      } else {
        console.error('Erro ao buscar detalhes da unidade', error)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnitDetails()
  }, [])

  const handleCreateUnit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/apartments/my-unit', {
        number: unitNumber,
        block: unitBlock,
        floor: unitFloor ? Number(unitFloor) : undefined,
        area: unitArea ? Number(unitArea) : undefined,
        type: unitType,
      })
      setUnitNumber('')
      setUnitBlock('')
      setUnitFloor('')
      setUnitArea('')
      setUnitType('Residencial')
      fetchUnitDetails()
    } catch (error) {
      console.error('Erro ao criar unidade', error)
      alert(error.response?.data?.message || 'Erro ao criar unidade')
    }
  }

  const handleOpenModal = (type) => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setName('')
    setRole('')
    setDocDate('')
    setType('')
    setPlate('')
    setEmergencyPhone('')
    setEmergencyKinship('')
  }

  const handleAddItem = async (e) => {
    e.preventDefault()

    try {
      let payload = {}
      let endpoint = ''

      if (modalType === 'resident') {
        payload = { name, role }
        endpoint = `/apartments/my-unit/residents`
      } else if (modalType === 'visitor') {
        payload = { name, authorizationDate: docDate }
        endpoint = `/apartments/my-unit/visitors`
      } else if (modalType === 'pet') {
        payload = { name, kind: type }
        endpoint = `/apartments/my-unit/pets`
      } else if (modalType === 'vehicle') {
        payload = { model: name, plate }
        endpoint = `/apartments/my-unit/vehicles`
      } else if (modalType === 'emergency') {
        payload = { name, phone: emergencyPhone, kinship: emergencyKinship }
        endpoint = `/apartments/my-unit/emergency-contacts`
      }

      await api.post(endpoint, payload)
      handleCloseModal()
      fetchUnitDetails()
    } catch (error) {
      console.error('Erro ao adicionar item', error)
    }
  }

  const handleDeleteItem = async (subType, id) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return
    try {
      await api.delete(`/apartments/my-unit/${subType}/${id}`)
      fetchUnitDetails()
    } catch (error) {
      console.error('Erro ao remover item', error)
    }
  }

  if (loading) {
    return <p style={{ padding: '24px', color: '#6b7280' }}>Carregando informações do apartamento...</p>
  }

  if (showCreateUnit) {
    return (
      <div style={{ background: '#fafaff', minHeight: '100%', padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', marginTop: '40px' }}>
          <h2 style={{ margin: 0, color: '#1e1b4b' }}>Cadastre sua unidade</h2>
          <p style={{ color: '#6b7280', marginTop: '8px', marginBottom: '24px' }}>
            Você ainda não possui uma unidade vinculada. Preencha os dados abaixo para começar.
          </p>

          <form onSubmit={handleCreateUnit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Número do apartamento</label>
              <input type="text" value={unitNumber} onChange={(e) => setUnitNumber(e.target.value)} required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Bloco</label>
              <input type="text" value={unitBlock} onChange={(e) => setUnitBlock(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Andar</label>
              <input type="number" value={unitFloor} onChange={(e) => setUnitFloor(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Área (m²)</label>
              <input type="number" value={unitArea} onChange={(e) => setUnitArea(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Tipo</label>
              <input type="text" value={unitType} onChange={(e) => setUnitType(e.target.value)} style={inputStyle} />
            </div>

            <button type="submit" style={buttonStyle}>Cadastrar Unidade</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#fafaff', minHeight: '100%', padding: '24px' }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: 0, fontSize: '30px', color: '#1e1b4b' }}>Minha Área / Unidade</h1>
        <p style={{ marginTop: '6px', color: '#6b7280' }}>Gerencie informações e dependências da sua unidade.</p>
      </div>

      {/* Resumo (Mini Stats) */}
      <div style={{ background: '#ffffff', border: '1px solid #ece9f5', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e1b4b' }}>🏠 Apartamento {unitData?.number || '—'}</h2>
          <p style={{ margin: '6px 0 0', color: '#6b7280' }}>Bloco {unitData?.block || '—'} • {unitData?.type || 'Residencial'}</p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <MiniStat value={residents.length} label="Moradores" />
          <MiniStat value={visitors.length} label="Visitantes" />
          <MiniStat value={pets.length} label="Pets" />
          <MiniStat value={vehicles.length} label="Veículos" />
        </div>
      </div>

      {/* Grid de Seções */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        <SectionCard title="Dados da Unidade" icon={Home}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <InfoItem label="Apartamento" value={unitData?.number} />
            <InfoItem label="Bloco" value={unitData?.block} />
            <InfoItem label="Andar" value={`${unitData?.floor}º`} />
            <InfoItem label="Área" value={unitData?.area ? `${unitData.area}m²` : '—'} />
            <InfoItem label="Tipo" value={unitData?.type} />
          </div>
        </SectionCard>

        <SectionCard title="Moradores Vinculados" icon={Users} showAddButton onAdd={() => handleOpenModal('resident')}>
          {residents.map((r) => (
            <div key={r._id} style={cardItemStyle}>
              <div>
                <strong style={cardItemTitleStyle}>{r.name}</strong>
                <p style={cardItemSubtitleStyle}>{r.role}</p>
              </div>
              <button onClick={() => handleDeleteItem('residents', r._id)} style={deleteBtnStyle}><Trash2 size={16} /></button>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Visitantes Autorizados" icon={UserPlus} showAddButton onAdd={() => handleOpenModal('visitor')}>
          {visitors.map((v) => (
            <div key={v._id} style={cardItemStyle}>
              <div>
                <strong style={cardItemTitleStyle}>{v.name}</strong>
                <p style={cardItemSubtitleStyle}>Autorizado até: {v.authorizationDate || 'Permanente'}</p>
              </div>
              <button onClick={() => handleDeleteItem('visitors', v._id)} style={deleteBtnStyle}><Trash2 size={16} /></button>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Veículos Vinculados" icon={Car} showAddButton onAdd={() => handleOpenModal('vehicle')}>
          {vehicles.map((v) => (
            <div key={v._id} style={cardItemStyle}>
              <div>
                <strong style={cardItemTitleStyle}>{v.model}</strong>
                <p style={cardItemSubtitleStyle}>Placa: {v.plate}</p>
              </div>
              <button onClick={() => handleDeleteItem('vehicles', v._id)} style={deleteBtnStyle}><Trash2 size={16} /></button>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Pets Cadastrados" icon={PawPrint} showAddButton onAdd={() => handleOpenModal('pet')}>
          {pets.map((p) => (
            <div key={p._id} style={cardItemStyle}>
              <div>
                <strong style={cardItemTitleStyle}>{p.name}</strong>
                <p style={cardItemSubtitleStyle}>{p.kind}</p>
              </div>
              <button onClick={() => handleDeleteItem('pets', p._id)} style={deleteBtnStyle}><Trash2 size={16} /></button>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Contatos de Emergência" icon={Phone} showAddButton onAdd={() => handleOpenModal('emergency')}>
          {emergencyContacts.map((c) => (
            <div key={c._id} style={cardItemStyle}>
              <div>
                <strong style={cardItemTitleStyle}>{c.name}</strong>
                <p style={cardItemSubtitleStyle}>{c.kinship || '—'}</p>
                <p style={cardItemPhoneStyle}>{c.phone}</p>
              </div>
              <button onClick={() => handleDeleteItem('emergency-contacts', c._id)} style={deleteBtnStyle}><Trash2 size={16} /></button>
            </div>
          ))}
        </SectionCard>
      </div>

      {/* Modal Genérico de Inclusão de Itens */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', color: '#1e1b4b' }}>
                {modalType === 'resident' && 'Adicionar Morador'}
                {modalType === 'visitor' && 'Adicionar Visitante'}
                {modalType === 'pet' && 'Cadastrar Pet'}
                {modalType === 'vehicle' && 'Cadastrar Veículo'}
                {modalType === 'emergency' && 'Adicionar Contato de Emergência'}
              </h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {modalType !== 'pet' && (
                <div>
                  <label style={labelStyle}>{modalType === 'vehicle' ? 'Modelo do Veículo' : 'Nome'}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                </div>
              )}

              {modalType === 'resident' && (
                <div>
                  <label style={labelStyle}>Cargo / Relação (ex: Morador principal)</label>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required style={inputStyle} />
                </div>
              )}

              {modalType === 'visitor' && (
                <div>
                  <label style={labelStyle}>Data Limite de Autorização</label>
                  <input type="date" value={docDate} onChange={(e) => setDocDate(e.target.value)} style={inputStyle} />
                </div>
              )}

              {modalType === 'vehicle' && (
                <div>
                  <label style={labelStyle}>Placa</label>
                  <input type="text" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="ABC-1234" required style={inputStyle} />
                </div>
              )}

              {modalType === 'pet' && (
                <>
                  <div>
                    <label style={labelStyle}>Nome do Pet</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tipo (Espécie / Raça)</label>
                    <input type="text" value={type} onChange={(e) => setType(e.target.value)} placeholder="Cachorro, Gato..." required style={inputStyle} />
                  </div>
                </>
              )}

              {modalType === 'emergency' && (
                <>
                  <div>
                    <label style={labelStyle}>Telefone</label>
                    <input type="text" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} required style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Parentesco / Relação</label>
                    <input type="text" value={emergencyKinship} onChange={(e) => setEmergencyKinship(e.target.value)} style={inputStyle} />
                  </div>
                </>
              )}

              <button type="submit" style={buttonStyle}>Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div>
      <h3 style={{ margin: 0, color: '#7c3aed', textAlign: 'center', fontSize: '20px' }}>{value}</h3>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>{label}</p>
    </div>
  )
}

const cardItemStyle = {
  padding: '12px',
  border: '1px solid #ece9f5',
  borderRadius: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const cardItemTitleStyle = {
  color: '#1e1b4b',
  fontSize: '15px',
}

const cardItemSubtitleStyle = {
  margin: '4px 0 0',
  color: '#6b7280',
  fontSize: '12px',
}

const cardItemPhoneStyle = {
  margin: '4px 0 0',
  color: '#1e1b4b',
  fontSize: '13px',
  fontWeight: '600',
}

const deleteBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  cursor: 'pointer',
  padding: '4px'
}

const buttonStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  background: '#7c3aed',
  color: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontWeight: '600',
  fontSize: '14px'
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  marginBottom: '6px',
  color: '#374151',
  fontWeight: '500'
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
  fontSize: '14px',
  color: '#000000',
}