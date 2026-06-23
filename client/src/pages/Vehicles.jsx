import { useEffect, useState } from 'react'
import {
  Car,
  ParkingCircle,
  ShieldCheck,
  Plus,
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const SectionCard = ({ title, icon: Icon, children }) => (
  <div
    style={{
      background: '#fff',
      border: '1px solid #ece9f5',
      borderRadius: '16px',
      padding: '24px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px',
      }}
    >
      <Icon size={20} color="#7c3aed" />
      <h3
        style={{
          margin: 0,
          color: '#1e1b4b',
        }}
      >
        {title}
      </h3>
    </div>

    {children}
  </div>
)

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)

  // Modal de cadastro de veículo
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [plate, setPlate] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [parkingSpot, setParkingSpot] = useState('')

  // Modal de condutor autorizado
  const [driverModal, setDriverModal] = useState(null) // id do veículo
  const [driverName, setDriverName] = useState('')
  const [driverPhone, setDriverPhone] = useState('')
  const [driverDoc, setDriverDoc] = useState('')

  // Modal de confirmação de exclusão (veículo ou condutor)
  // { kind: 'vehicle', id, label } ou { kind: 'driver', vehicleId, driverId, label }
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles/me')
      setVehicles(data?.data?.vehicles || [])
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Erro ao buscar veículos', error)
        toast.error(error.response?.data?.message || 'Erro ao buscar veículos')
      }
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleCreateVehicle = async (e) => {
    e.preventDefault()
    try {
      await api.post('/vehicles', { plate, brand, model, color, parkingSpot })
      toast.success('Veículo cadastrado com sucesso')
      setPlate('')
      setBrand('')
      setModel('')
      setColor('')
      setParkingSpot('')
      setIsModalOpen(false)
      fetchVehicles()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar veículo')
    }
  }

  // Abre o modal de confirmação para excluir veículo
  const handleRequestDeleteVehicle = (vehicle) => {
    const label = [vehicle.brand, vehicle.model].filter(Boolean).join(' ') || vehicle.plate
    setDeleteTarget({ kind: 'vehicle', id: vehicle._id, label })
  }

  // Abre o modal de confirmação para remover condutor
  const handleRequestRemoveDriver = (vehicleId, driver) => {
    setDeleteTarget({ kind: 'driver', vehicleId, driverId: driver._id, label: driver.name })
  }

  const handleCloseDeleteModal = () => {
    setDeleteTarget(null)
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    if (deleteTarget.kind === 'vehicle') {
      try {
        await api.delete(`/vehicles/${deleteTarget.id}`)
        toast.success('Veículo removido')
        fetchVehicles()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erro ao remover veículo')
      }
    } else if (deleteTarget.kind === 'driver') {
      try {
        await api.delete(`/vehicles/${deleteTarget.vehicleId}/authorized-drivers/${deleteTarget.driverId}`)
        toast.success('Condutor removido')
        fetchVehicles()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erro ao remover condutor')
      }
    }

    setDeleteTarget(null)
  }

  const handleAddDriver = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/vehicles/${driverModal}/authorized-drivers`, {
        name: driverName,
        phone: driverPhone,
        document: driverDoc,
      })
      toast.success('Condutor autorizado adicionado')
      setDriverName('')
      setDriverPhone('')
      setDriverDoc('')
      setDriverModal(null)
      fetchVehicles()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar condutor')
    }
  }

  const coveredSpots = vehicles.filter((v) => v.parkingSpot).length
  const authorizedDrivers = vehicles.flatMap((v) =>
    (v.authorizedDrivers || []).map((d) => ({ ...d, vehicleId: v._id, vehicleModel: v.model || v.plate }))
  )

  if (loading) {
    return <p style={{ color: '#6b7280' }}>Carregando veículos...</p>
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            margin: 0,
            color: '#1e1b4b',
            fontSize: '30px',
          }}
        >
          Veículos
        </h1>

        <p
          style={{
            marginTop: '6px',
            color: '#6b7280',
          }}
        >
          Gerencie os veículos vinculados à sua unidade.
        </p>
      </div>

      {/* Resumo */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #ece9f5',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <MiniStat value={vehicles.length} label="Veículos" />
        <MiniStat value={coveredSpots} label="Com Vaga" />
        <MiniStat value={authorizedDrivers.length} label="Condutores Autorizados" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: '20px',
        }}
      >
        <SectionCard title="Veículos Cadastrados" icon={Car}>
          {vehicles.length === 0 && (
            <p style={{ color: '#9ca3af', margin: '0 0 12px' }}>Nenhum veículo cadastrado.</p>
          )}

          {vehicles.map((v) => (
            <div
              key={v._id}
              style={{
                border: '1px solid #ece9f5',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Car size={18} color="#6b7280" />
                  <strong style={{ color: '#6b7280', fontWeight: '600' }}>
                    {[v.brand, v.model].filter(Boolean).join(' ') || 'Veículo'}
                  </strong>
                </div>
                <p style={{ color: '#6b7280', margin: '6px 0 0' }}>{v.plate}</p>
                {v.color && <p style={{ color: '#6b7280', margin: '2px 0 0' }}>Cor: {v.color}</p>}
                {v.parkingSpot && <p style={{ color: '#6b7280', margin: '2px 0 0' }}>Vaga: {v.parkingSpot}</p>}
              </div>
              <button onClick={() => handleRequestDeleteVehicle(v)} style={deleteBtnStyle}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button style={buttonStyle} onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Adicionar Veículo
          </button>
        </SectionCard>

        <SectionCard title="Vagas de Garagem" icon={ParkingCircle}>
          {vehicles.filter((v) => v.parkingSpot).length === 0 && (
            <p style={{ color: '#9ca3af', margin: 0 }}>Nenhuma vaga vinculada.</p>
          )}
          {vehicles
            .filter((v) => v.parkingSpot)
            .map((v) => (
              <Info
                key={v._id}
                label={
                  <span style={{ color: '#6b7280', fontWeight: '300' }}>
                    {[v.brand, v.model].filter(Boolean).join(' ') || v.plate}
                  </span>
                }
                value={
                  <span style={{ color: '#6b7280', fontWeight: '300' }}>
                    Vaga {v.parkingSpot}
                  </span>
                }
              />
            ))}
        </SectionCard>

        <SectionCard title="Condutores Autorizados" icon={ShieldCheck}>
          {authorizedDrivers.length === 0 && (
            <p style={{ color: '#6b7280', fontWeight: '300', margin: '0 0 12px' }}>Nenhum condutor autorizado.</p>
          )}
          {authorizedDrivers.map((d) => (
            <div
              key={d._id}
              style={{
                border: '1px solid #ece9f5',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div>
                <strong>{d.name}</strong>
                <p style={{ color: '#6b7280', margin: '6px 0 0' }}>{d.vehicleModel}</p>
                {d.phone && <p style={{ color: '#6b7280', margin: '2px 0 0' }}>{d.phone}</p>}
              </div>
              <button onClick={() => handleRequestRemoveDriver(d.vehicleId, d)} style={deleteBtnStyle}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {vehicles.length > 0 && (
            <button style={buttonStyle} onClick={() => setDriverModal(vehicles[0]._id)}>
              <Plus size={16} />
              Autorizar Condutor
            </button>
          )}
        </SectionCard>
      </div>

      {/* Modal: novo veículo */}
      {isModalOpen && (
        <Modal title="Cadastrar Veículo" onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleCreateVehicle} style={formStyle}>
            <Field label="Placa">
              <input value={plate} onChange={(e) => setPlate(e.target.value)} required placeholder="ABC-1234" style={inputStyle} />
            </Field>
            <Field label="Marca">
              <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Honda" style={inputStyle} />
            </Field>
            <Field label="Modelo">
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Civic" style={inputStyle} />
            </Field>
            <Field label="Cor">
              <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Preto" style={inputStyle} />
            </Field>
            <Field label="Vaga">
              <input value={parkingSpot} onChange={(e) => setParkingSpot(e.target.value)} placeholder="12" style={inputStyle} />
            </Field>
            <button type="submit" style={buttonStyle}>Salvar</button>
          </form>
        </Modal>
      )}

      {/* Modal: condutor autorizado */}
      {driverModal && (
        <Modal title="Autorizar Condutor" onClose={() => setDriverModal(null)}>
          <form onSubmit={handleAddDriver} style={formStyle}>
            <Field label="Veículo">
              <select value={driverModal} onChange={(e) => setDriverModal(e.target.value)} style={inputStyle}>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {[v.brand, v.model].filter(Boolean).join(' ') || v.plate}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nome">
              <input value={driverName} onChange={(e) => setDriverName(e.target.value)} required style={inputStyle} />
            </Field>
            <Field label="Telefone">
              <input value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Documento">
              <input value={driverDoc} onChange={(e) => setDriverDoc(e.target.value)} style={inputStyle} />
            </Field>
            <button type="submit" style={buttonStyle}>Salvar</button>
          </form>
        </Modal>
      )}

      {/* Modal: confirmação de exclusão (veículo ou condutor) */}
      {deleteTarget && (
        <Modal title="" onClose={handleCloseDeleteModal}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}
            >
              <AlertTriangle size={22} color="#ef4444" />
            </div>

            <h2 style={{ margin: '0 0 8px', fontSize: '17px', color: '#1e1b4b' }}>
              {deleteTarget.kind === 'vehicle' ? 'Remover veículo' : 'Remover condutor'}
            </h2>
            <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
              Tem certeza que deseja remover{' '}
              <strong style={{ color: '#1e1b4b' }}>{deleteTarget.label || 'este item'}</strong>? Essa ação não pode ser desfeita.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleCloseDeleteModal} style={cancelBtnStyle}>Cancelar</button>
              <button onClick={handleConfirmDelete} style={confirmDeleteBtnStyle}>Remover</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '400px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: title ? '20px' : 0 }}>
          {title ? <h2 style={{ margin: 0, fontSize: '18px', color: '#1e1b4b' }}>{title}</h2> : <span />}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

function MiniStat({ value, label }) {
  return (
    <div>
      <h3 style={{ margin: 0, color: '#7c3aed' }}>{value}</h3>
      <p style={{ margin: 0, color: '#6b7280' }}>{label}</p>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{label}</p>
      <strong>{value}</strong>
    </div>
  )
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

const buttonStyle = {
  width: '100%',
  marginTop: '10px',
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  background: '#7c3aed',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
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

const cancelBtnStyle = {
  flex: 1,
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '10px',
  background: '#fff',
  color: '#374151',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
}

const confirmDeleteBtnStyle = {
  flex: 1,
  padding: '12px',
  border: 'none',
  borderRadius: '10px',
  background: '#ef4444',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
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