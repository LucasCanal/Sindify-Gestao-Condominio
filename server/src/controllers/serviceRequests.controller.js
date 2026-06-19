const ServiceRequest = require('../models/ServiceRequest')
const { success, created, notFound } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')
const { getIO } = require('../config/socket')

// Abrir chamado
const createServiceRequest = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body

    const serviceRequest = await ServiceRequest.create({
      title,
      description,
      category,
      priority,
      apartment: req.user.apartment,
      requestedBy: req.user._id,
      photos: req.files?.map((f) => f.path) || [],
    })

    // Notifica síndico em tempo real
    try {
      const io = getIO()
      io.to('admin').emit('serviceRequest:new', {
        message: `Novo chamado: ${title}`,
        serviceRequest,
      })
    } catch (_) {}

    return created(res, { serviceRequest }, 'Chamado aberto com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar todos os chamados (síndico/zelador)
const getServiceRequests = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.status)   filter.status = req.query.status
    if (req.query.category) filter.category = req.query.category
    if (req.query.priority) filter.priority = req.query.priority

    const [serviceRequests, total] = await Promise.all([
      ServiceRequest.find(filter)
        .populate('requestedBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('apartment', 'number block')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      ServiceRequest.countDocuments(filter),
    ])

    return success(res, paginatedResponse(serviceRequests, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Meus chamados
const getMyServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find({
      requestedBy: req.user._id,
    })
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })

    return success(res, { serviceRequests })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar chamado por ID
const getServiceRequestById = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
      .populate('requestedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('apartment', 'number block')

    if (!serviceRequest) return notFound(res, 'Chamado não encontrado')
    return success(res, { serviceRequest })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Atualizar status do chamado (síndico/zelador)
const updateServiceRequest = async (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body

    const serviceRequest = await ServiceRequest.findById(req.params.id)
    if (!serviceRequest) return notFound(res, 'Chamado não encontrado')

    if (status) serviceRequest.status = status
    if (assignedTo) serviceRequest.assignedTo = assignedTo
    if (notes) serviceRequest.notes = notes
    if (status === 'concluido') serviceRequest.resolvedAt = new Date()

    await serviceRequest.save()

    // Notifica o morador que abriu o chamado
    try {
      const io = getIO()
      io.to(`apartment:${serviceRequest.apartment}`).emit('serviceRequest:updated', {
        message: `Chamado "${serviceRequest.title}" atualizado para: ${status}`,
        serviceRequest,
      })
    } catch (_) {}

    return success(res, { serviceRequest }, 'Chamado atualizado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Cancelar chamado
const cancelServiceRequest = async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id)
    if (!serviceRequest) return notFound(res, 'Chamado não encontrado')

    const isOwner = serviceRequest.requestedBy.toString() === req.user._id.toString()
    const isSindico = req.user.role === 'sindico'

    if (!isOwner && !isSindico) {
      return res.status(403).json({ ok: false, message: 'Acesso negado' })
    }

    serviceRequest.status = 'cancelado'
    await serviceRequest.save()

    return success(res, { serviceRequest }, 'Chamado cancelado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  createServiceRequest,
  getServiceRequests,
  getMyServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  cancelServiceRequest,
}